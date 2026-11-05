import express from 'express';
import multer from 'multer';
import path from 'path';
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

  if (!isCloudinaryConfigured()) {
    return res.status(500).json({
      success: false,
      message: 'Permanent image storage is not configured'
    });
  }

  try {
    const sanitizedFilename = path.basename(req.file.originalname || 'upload').replace(/[^a-zA-Z0-9_.-]/g, '_');
    const folder = (req.body.folder || 'vetnova/media').toString().replace(/[^a-zA-Z0-9_\-/]/g, '');
    
    const cloudResult = await uploadBufferToCloudinary(req.file.buffer, folder, sanitizedFilename);

    let mediaObj = null;
    try {
      const media = new Media({
        filename: sanitizedFilename,
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
    return res.status(500).json({
      success: false,
      message: 'Error processing media upload'
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
      await deleteCloudinaryAsset(media.public_id);
    }

    await media.deleteOne();
    return res.json({ success: true, message: 'Media record deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error deleting media record' });
  }
});

export default router;
