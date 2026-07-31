"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const Media_1 = require("../models/Media");
const router = express_1.default.Router();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
    api_key: process.env.CLOUDINARY_API_KEY || '894676451677351',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'secret',
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: 'vetnova',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});
const upload = (0, multer_1.default)({ storage });
router.post('/', authMiddleware_1.protect, authMiddleware_1.admin, upload.single('image'), async (req, res) => {
    if (req.file) {
        try {
            const media = new Media_1.Media({
                filename: req.file.originalname || req.file.filename,
                url: req.file.path,
                public_id: req.file.filename, // Cloudinary uses this as public_id
                format: req.file.mimetype,
                size: req.file.size
            });
            await media.save();
            res.json({ url: req.file.path, media });
        }
        catch (error) {
            res.status(500).json({ message: 'Error saving media record' });
        }
    }
    else {
        res.status(400).json({ message: 'No file uploaded' });
    }
});
router.delete('/:id', authMiddleware_1.protect, authMiddleware_1.admin, async (req, res) => {
    try {
        const media = await Media_1.Media.findById(req.params.id);
        if (!media)
            return res.status(404).json({ message: 'Media not found' });
        if (media.public_id) {
            await cloudinary_1.v2.uploader.destroy(media.public_id);
        }
        await media.deleteOne();
        res.json({ message: 'Media deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.default = router;
//# sourceMappingURL=uploadRoutes.js.map