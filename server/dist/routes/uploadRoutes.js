"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const Media_1 = require("../models/Media");
const cloudinaryConfig_1 = require("../config/cloudinaryConfig");
const router = express_1.default.Router();
// Memory storage only - zero local disk writing in production or dev
const memoryStorage = multer_1.default.memoryStorage();
const allowedMimetypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
const upload = (0, multer_1.default)({
    storage: memoryStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname || '').toLowerCase();
        const isMimeValid = allowedMimetypes.includes(file.mimetype) || file.mimetype.startsWith('image/');
        const isExtValid = allowedExtensions.includes(ext) || ext === '';
        if (isMimeValid && isExtValid) {
            cb(null, true);
        }
        else {
            cb(new Error('Only JPG, JPEG, PNG, or WEBP images up to 5MB are allowed.'));
        }
    }
});
router.post('/', authMiddleware_1.protect, authMiddleware_1.admin, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('[Upload Middleware Error]:', err);
            if (err instanceof multer_1.default.MulterError && err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, message: 'File size must be less than 5MB' });
            }
            return res.status(400).json({ success: false, message: err.message || 'Image upload failed' });
        }
        next();
    });
}, async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }
    if (!(0, cloudinaryConfig_1.isCloudinaryConfigured)()) {
        console.error('[Storage Error] Cloudinary credentials missing or unconfigured.');
        return res.status(500).json({
            success: false,
            message: 'Permanent image storage is not configured'
        });
    }
    try {
        const folder = (req.body.folder || 'vetnova/media').toString();
        const cloudResult = await (0, cloudinaryConfig_1.uploadBufferToCloudinary)(req.file.buffer, folder, req.file.originalname);
        let mediaObj = null;
        try {
            const media = new Media_1.Media({
                filename: req.file.originalname || cloudResult.public_id,
                url: cloudResult.secure_url,
                public_id: cloudResult.public_id,
                format: cloudResult.format,
                size: cloudResult.bytes,
                folder: folder
            });
            mediaObj = await media.save();
        }
        catch (mediaErr) {
            console.warn('[Storage Warning] Failed to create Media record:', mediaErr);
        }
        return res.status(200).json({
            success: true,
            url: cloudResult.secure_url,
            media: mediaObj
        });
    }
    catch (error) {
        console.error('[Upload Handler Error]:', error);
        return res.status(500).json({
            success: false,
            message: error?.message || 'Error processing media upload',
            error: error?.message || 'Server processing error'
        });
    }
});
router.delete('/:id', authMiddleware_1.protect, authMiddleware_1.admin, async (req, res) => {
    try {
        const media = await Media_1.Media.findById(req.params.id);
        if (!media)
            return res.status(404).json({ success: false, message: 'Media record not found' });
        if (media.public_id) {
            await (0, cloudinaryConfig_1.deleteCloudinaryAsset)(media.public_id);
        }
        await media.deleteOne();
        return res.json({ success: true, message: 'Media record deleted successfully' });
    }
    catch (error) {
        console.error('[Delete Media Error]:', error);
        return res.status(500).json({ success: false, message: 'Server Error', error: error?.message });
    }
});
exports.default = router;
//# sourceMappingURL=uploadRoutes.js.map