"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const Media_1 = require("../models/Media");
const cloudinaryConfig_1 = require("../config/cloudinaryConfig");
const router = express_1.default.Router();
const memoryStorage = multer_1.default.memoryStorage();
const allowedMimetypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
const getParamId = (req) => {
    const rawId = req.params.id;
    return Array.isArray(rawId) ? rawId[0] : String(rawId || '');
};
const isMagicBytesValid = (buffer) => {
    if (!buffer || buffer.length < 4)
        return false;
    const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
    const isRiff = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
    const isWebp = isRiff && buffer.length >= 12 && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
    return isJpeg || isPng || isWebp;
};
const upload = (0, multer_1.default)({
    storage: memoryStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname || '').toLowerCase();
        if (['.svg', '.exe', '.php', '.js', '.html', '.htm', '.sh', '.bat'].includes(ext)) {
            return cb(new Error('Executable and SVG files are strictly prohibited for security reasons.'));
        }
        const isMimeValid = allowedMimetypes.includes(file.mimetype);
        const isExtValid = allowedExtensions.includes(ext);
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
            if (err instanceof multer_1.default.MulterError && err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, message: 'File size must be less than 5MB' });
            }
            return res.status(400).json({ success: false, message: err.message || 'Image upload failed' });
        }
        next();
    });
}, async (req, res) => {
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
        const ext = path_1.default.extname(req.file.originalname || '.jpg').toLowerCase();
        const baseName = path_1.default.basename(req.file.originalname || 'upload', ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        const sanitizedFilename = `${baseName}${ext}`;
        const folder = (req.body.folder || 'vetnova/media').toString().replace(/[^a-zA-Z0-9_\-/]/g, '');
        let imageUrl = '';
        let publicId = '';
        let format = ext.replace('.', '') || 'jpg';
        let bytes = req.file.buffer.length;
        if ((0, cloudinaryConfig_1.isCloudinaryConfigured)()) {
            const cloudResult = await (0, cloudinaryConfig_1.uploadBufferToCloudinary)(req.file.buffer, folder, sanitizedFilename);
            imageUrl = cloudResult.secure_url;
            publicId = cloudResult.public_id;
            format = cloudResult.format || format;
            bytes = cloudResult.bytes || bytes;
        }
        else {
            // Local persistent storage fallback
            const uploadsDir = path_1.default.join(__dirname, '../../uploads');
            if (!fs_1.default.existsSync(uploadsDir)) {
                fs_1.default.mkdirSync(uploadsDir, { recursive: true });
            }
            const uniqueFilename = `${baseName}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
            const filePath = path_1.default.join(uploadsDir, uniqueFilename);
            fs_1.default.writeFileSync(filePath, req.file.buffer);
            // Return server-hosted URL
            const host = req.get('host') || 'localhost:5001';
            const protocol = req.protocol || 'http';
            imageUrl = `${protocol}://${host}/uploads/${uniqueFilename}`;
            publicId = `local/${uniqueFilename}`;
        }
        let mediaObj = null;
        try {
            const media = new Media_1.Media({
                filename: sanitizedFilename,
                url: imageUrl,
                public_id: publicId,
                format: format,
                size: bytes,
                folder: folder
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
        console.error('Upload handler error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error processing media upload'
        });
    }
});
router.delete('/:id', authMiddleware_1.protect, authMiddleware_1.admin, async (req, res) => {
    try {
        const id = getParamId(req);
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid media ID' });
        }
        const media = await Media_1.Media.findById(id);
        if (!media)
            return res.status(404).json({ success: false, message: 'Media record not found' });
        if (media.public_id) {
            if (media.public_id.startsWith('local/')) {
                const localFileName = media.public_id.replace('local/', '');
                const localPath = path_1.default.join(__dirname, '../../uploads', localFileName);
                if (fs_1.default.existsSync(localPath)) {
                    try {
                        fs_1.default.unlinkSync(localPath);
                    }
                    catch (e) { /* ignore */ }
                }
            }
            else {
                await (0, cloudinaryConfig_1.deleteCloudinaryAsset)(media.public_id);
            }
        }
        await media.deleteOne();
        return res.json({ success: true, message: 'Media record deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Error deleting media record' });
    }
});
exports.default = router;
//# sourceMappingURL=uploadRoutes.js.map