import express from 'express';
import multer from 'multer';
import path from 'path';
import { admin, protect, AuthRequest } from '../middlewares/authMiddleware';
import { Media } from '../models/Media';
import {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
  deleteCloudinaryAsset
} from '../config/cloudinaryConfig';

const router = express.Router();

// Memory storage only - zero local disk writing in production or dev
const memoryStorage = multer.memoryStorage();

const allowedMimetypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

const upload = multer({
  storage: memoryStorage,
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
      console.error('[Upload Middleware Error]:', err);
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

  if (!isCloudinaryConfigured()) {
    console.error('[Storage Error] Cloudinary credentials missing or unconfigured.');
    return res.status(500).json({
      success: false,
      message: 'Permanent image storage is not configured'
    });
  }

  try {
    const folder = (req.body.folder || 'vetnova/media').toString();
    const cloudResult = await uploadBufferToCloudinary(req.file.buffer, folder, req.file.originalname);

    let mediaObj = null;
    try {
      const media = new Media({
        filename: req.file.originalname || cloudResult.public_id,
        url: cloudResult.secure_url,
        public_id: cloudResult.public_id,
        format: cloudResult.format,
        size: cloudResult.bytes,
        folder: folder
      });
      mediaObj = await media.save();
    } catch (mediaErr) {
      console.warn('[Storage Warning] Failed to create Media record:', mediaErr);
    }

    return res.status(200).json({
      success: true,
      url: cloudResult.secure_url,
      media: mediaObj
    });
  } catch (error: any) {
    console.error('[Upload Handler Error]:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Error processing media upload',
      error: error?.message || 'Server processing error'
    });
  }
});

router.delete('/:id', protect, admin, async (req: AuthRequest, res: express.Response) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ success: false, message: 'Media record not found' });
    
    if (media.public_id) {
      await deleteCloudinaryAsset(media.public_id);
    }

    await media.deleteOne();
    return res.json({ success: true, message: 'Media record deleted successfully' });
  } catch (error: any) {
    console.error('[Delete Media Error]:', error);
    return res.status(500).json({ success: false, message: 'Server Error', error: error?.message });
  }
});

export default router;
