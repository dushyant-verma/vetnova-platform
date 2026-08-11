import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { v2 as cloudinary } from 'cloudinary';
import { admin, protect, AuthRequest } from '../middlewares/authMiddleware';
import { Media } from '../models/Media';

const router = express.Router();

// Writable temporary directory for upload processing
let uploadsDir = path.join(process.cwd(), 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  // If process.cwd()/uploads is not writable, fallback to os.tmpdir()
  uploadsDir = path.join(os.tmpdir(), 'vetnova-uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

// Disk storage for temporary processing
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure destination exists
    if (!fs.existsSync(uploadsDir)) {
      try {
        fs.mkdirSync(uploadsDir, { recursive: true });
      } catch (err) {
        uploadsDir = os.tmpdir();
      }
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const original = file.originalname || 'image.webp';
    const ext = path.extname(original) || '.webp';
    cb(null, `file-${uniqueSuffix}${ext.toLowerCase()}`);
  }
});

const allowedMimetypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

const upload = multer({
  storage: localStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const isMimeValid = allowedMimetypes.includes(file.mimetype) || file.mimetype.startsWith('image/');
    const isExtValid = allowedExtensions.includes(ext) || ext === '';

    if (isMimeValid && isExtValid) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, PNG, or WEBP images up to 5MB are allowed.'));
    }
  }
});

router.post('/', protect, admin, (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  upload.single('image')(req, res, (err: any) => {
    if (err) {
      console.error('Upload middleware error:', err);
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File size must be less than 5MB' });
      }
      return res.status(400).json({ success: false, message: err.message || 'Image upload failed' });
    }
    next();
  });
}, async (req: AuthRequest, res: express.Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file uploaded' });
  }

  try {
    let imageUrl = '';
    let publicId = req.file.filename;

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const cloudinaryUrl = process.env.CLOUDINARY_URL;

    const hasCloudinary = Boolean(
      cloudinaryUrl ||
      (cloudName && cloudName !== 'demo' && apiKey && apiKey !== '894676451677351' && apiSecret)
    );

    if (hasCloudinary) {
      try {
        if (cloudinaryUrl) {
          cloudinary.config({ cloudinary_url: cloudinaryUrl });
        } else {
          cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
          });
        }

        const cloudResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'vetnova'
        });
        imageUrl = cloudResult.secure_url || cloudResult.url;
        publicId = cloudResult.public_id;
        
        // Clean up local temp file after Cloudinary upload
        if (req.file.path && fs.existsSync(req.file.path)) {
          fs.unlink(req.file.path, () => {});
        }
      } catch (cloudErr: any) {
        console.error('Cloudinary upload error:', cloudErr?.message || cloudErr);
      }
    }

    if (!imageUrl) {
      // Local static HTTP URL fallback
      const host = req.get('host') || 'localhost:5001';
      const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
      imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    let mediaObj = null;
    try {
      const media = new Media({
        filename: req.file.originalname || req.file.filename,
        url: imageUrl,
        public_id: publicId,
        format: req.file.mimetype,
        size: req.file.size
      });
      mediaObj = await media.save();
    } catch (mediaErr) {
      console.warn('Could not save Media record in database, returning image URL:', mediaErr);
    }

    return res.status(200).json({
      success: true,
      url: imageUrl,
      media: mediaObj
    });
  } catch (error: any) {
    console.error('Error in upload route handler:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing media upload',
      error: error?.message || 'Server processing error'
    });
  }
});

router.delete('/:id', protect, admin, async (req: AuthRequest, res: express.Response) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ success: false, message: 'Media not found' });
    
    if (media.public_id && !media.public_id.includes('.')) {
       try {
         await cloudinary.uploader.destroy(media.public_id);
       } catch (e) {
         // ignore Cloudinary delete errors if unconfigured
       }
    }
    await media.deleteOne();
    res.json({ success: true, message: 'Media deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server Error', error: error?.message });
  }
});

export default router;
