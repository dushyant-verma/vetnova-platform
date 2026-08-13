"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const Media_1 = require("../models/Media");
const cloudinaryConfig_1 = require("../config/cloudinaryConfig");
const router = express_1.default.Router();
// Multer memory storage for direct Cloudinary stream upload
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
    const isProd = process.env.NODE_ENV === 'production';
    const hasCloudinary = (0, cloudinaryConfig_1.isCloudinaryConfigured)();
    try {
        let imageUrl = '';
        let publicId = '';
        let format = req.file.mimetype;
        let size = req.file.size;
        if (hasCloudinary) {
            // Determine folder based on request query/body context or default media
            const folder = (req.body.folder || 'vetnova/media').toString();
            const cloudResult = await (0, cloudinaryConfig_1.uploadBufferToCloudinary)(req.file.buffer, folder, req.file.originalname);
            imageUrl = cloudResult.secure_url;
            publicId = cloudResult.public_id;
            format = cloudResult.format;
            size = cloudResult.bytes;
        }
        else {
            if (isProd) {
                console.error('[Storage Error] Cloudinary is unconfigured in production environment!');
                return res.status(500).json({
                    success: false,
                    message: 'Permanent cloud media storage is not configured. Upload rejected to prevent data loss.'
                });
            }
            // Local development fallback only
            console.warn('[Storage Warning] Cloudinary unconfigured. Using local development fallback storage.');
            const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
            if (!fs_1.default.existsSync(uploadsDir)) {
                fs_1.default.mkdirSync(uploadsDir, { recursive: true });
            }
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = path_1.default.extname(req.file.originalname || '.webp') || '.webp';
            const filename = `dev-${uniqueSuffix}${ext.toLowerCase()}`;
            const filePath = path_1.default.join(uploadsDir, filename);
            fs_1.default.writeFileSync(filePath, req.file.buffer);
            const host = req.get('host') || 'localhost:5001';
            const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
            imageUrl = `${protocol}://${host}/uploads/${filename}`;
            publicId = filename;
        }
        let mediaObj = null;
        try {
            const media = new Media_1.Media({
                filename: req.file.originalname || publicId,
                url: imageUrl,
                public_id: publicId,
                format: format,
                size: size
            });
            mediaObj = await media.save();
        }
        catch (mediaErr) {
            console.warn('[Storage Warning] Failed to create Media record:', mediaErr);
        }
        return res.status(200).json({
            success: true,
            url: imageUrl,
            media: mediaObj
        });
    }
    catch (error) {
        console.error('[Upload Handler Error]:', error);
        return res.status(500).json({
            success: false,
            message: 'Error processing media upload',
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