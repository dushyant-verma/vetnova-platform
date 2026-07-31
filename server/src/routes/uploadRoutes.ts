import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { admin, protect } from '../middlewares/authMiddleware';

import { Media } from '../models/Media';

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '894676451677351',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'secret',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vetnova',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  } as any,
});

const upload = multer({ storage });

router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  if (req.file) {
    try {
      const media = new Media({
        filename: req.file.originalname || req.file.filename,
        url: req.file.path,
        public_id: req.file.filename, // Cloudinary uses this as public_id
        format: req.file.mimetype,
        size: req.file.size
      });
      await media.save();
      res.json({ url: req.file.path, media });
    } catch (error) {
      res.status(500).json({ message: 'Error saving media record' });
    }
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'Media not found' });
    
    if (media.public_id) {
       await cloudinary.uploader.destroy(media.public_id);
    }
    await media.deleteOne();
    res.json({ message: 'Media deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
