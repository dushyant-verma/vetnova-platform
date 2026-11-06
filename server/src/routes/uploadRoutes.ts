import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { admin, protect, AuthRequest } from '../middlewares/authMiddleware';
import { Media } from '../models/Media';
import {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
  deleteCloudinaryAsset
} from '../config/cloudinaryConfig';

const router = express.Router();

const memoryStorage = multer.memoryStorage();
const allowedMimetypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

const getParamId = (req: express.Request): string => {
  const rawId = req.params.id;
  return Array.isArray(rawId) ? rawId[0] : String(rawId || '');
};

const isMagicBytesValid = (buffer: Buffer): boolean => {
  if (!buffer || buffer.length < 4) return false;
  
  const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
  const isRiff = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
  const isWebp = isRiff && buffer.length >= 12 && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;

  return isJpeg || isPng || isWebp;
};

const upload = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    
    if (['.svg', '.exe', '.php', '.js', '.html', '.htm', '.sh', '.bat'].includes(ext)) {
      return cb(new Error('Executable and SVG files are strictly prohibited for security reasons.'));
    }

    const isMimeValid = allowedMimetypes.includes(file.mimetype);
    const isExtValid = allowedExtensions.includes(ext);

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
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File size must be less than 5MB' });
      }
      return res.status(400).json({ success: false, message: err.message || 'Image upload failed' });
    }
    next();
  });
}, async (req: AuthRequest, res: express.Response) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ success: false, message: 'No image file uploaded' });
  }

  if (!isMagicBytesValid(req.file.buffer)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file signature. File content does not match allowed image formats (JPG, PNG, WEBP).'
    });
  }

  try {
    const ext = path.extname(req.file.originalname || '.jpg').toLowerCase();
    const baseName = path.basename(req.file.originalname || 'upload', ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const sanitizedFilename = `${baseName}${ext}`;
    const folder = (req.body.folder || 'vetnova/media').toString().replace(/[^a-zA-Z0-9_\-/]/g, '');

    let imageUrl = '';
    let publicId = '';
    let format = ext.replace('.', '') || 'jpg';
    let bytes = req.file.buffer.length;

    if (isCloudinaryConfigured()) {
      const cloudResult = await uploadBufferToCloudinary(req.file.buffer, folder, sanitizedFilename);
      imageUrl = cloudResult.secure_url;
      publicId = cloudResult.public_id;
      format = cloudResult.format || format;
      bytes = cloudResult.bytes || bytes;
    } else {
      // Local persistent storage fallback
      const uploadsDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const uniqueFilename = `${baseName}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const filePath = path.join(uploadsDir, uniqueFilename);
      fs.writeFileSync(filePath, req.file.buffer);

      // Return server-hosted URL
      const host = req.get('host') || 'localhost:5001';
      const protocol = req.protocol || 'http';
      imageUrl = `${protocol}://${host}/uploads/${uniqueFilename}`;
      publicId = `local/${uniqueFilename}`;
    }

    let mediaObj = null;
    try {
      const media = new Media({
        filename: sanitizedFilename,
        url: imageUrl,
        public_id: publicId,
        format: format,
        size: bytes,
        folder: folder
      });
      mediaObj = await media.save();
    } catch (mediaErr) {
      console.warn('[Storage Warning] Failed to create Media record:', mediaErr);
    }

    return res.status(200).json({
      success: true,
      url: imageUrl,
      media: mediaObj
    });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing media upload'
    });
  }
});

router.delete('/:id', protect, admin, async (req: AuthRequest, res: express.Response) => {
  try {
    const id = getParamId(req);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid media ID' });
    }

    const media = await Media.findById(id);
    if (!media) return res.status(404).json({ success: false, message: 'Media record not found' });
    
    if (media.public_id) {
      if (media.public_id.startsWith('local/')) {
        const localFileName = media.public_id.replace('local/', '');
        const localPath = path.join(__dirname, '../../uploads', localFileName);
        if (fs.existsSync(localPath)) {
          try { fs.unlinkSync(localPath); } catch (e) { /* ignore */ }
        }
      } else {
        await deleteCloudinaryAsset(media.public_id);
      }
    }

    await media.deleteOne();
    return res.json({ success: true, message: 'Media record deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error deleting media record' });
  }
});

export default router;
