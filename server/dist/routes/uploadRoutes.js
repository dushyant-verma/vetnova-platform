"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const cloudinary_1 = require("cloudinary");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const Media_1 = require("../models/Media");
const router = express_1.default.Router();
// Writable temporary directory for upload processing
let uploadsDir = path_1.default.join(process.cwd(), 'uploads');
try {
    if (!fs_1.default.existsSync(uploadsDir)) {
        fs_1.default.mkdirSync(uploadsDir, { recursive: true });
    }
}
catch (e) {
    // If process.cwd()/uploads is not writable, fallback to os.tmpdir()
    uploadsDir = path_1.default.join(os_1.default.tmpdir(), 'vetnova-uploads');
    if (!fs_1.default.existsSync(uploadsDir)) {
        fs_1.default.mkdirSync(uploadsDir, { recursive: true });
    }
}
// Disk storage for temporary processing
const localStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Ensure destination exists
        if (!fs_1.default.existsSync(uploadsDir)) {
            try {
                fs_1.default.mkdirSync(uploadsDir, { recursive: true });
            }
            catch (err) {
                uploadsDir = os_1.default.tmpdir();
            }
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const original = file.originalname || 'image.webp';
        const ext = path_1.default.extname(original) || '.webp';
        cb(null, `file-${uniqueSuffix}${ext.toLowerCase()}`);
    }
});
const allowedMimetypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
const upload = (0, multer_1.default)({
    storage: localStorage,
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
            console.error('Upload middleware error:', err);
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
    try {
        let imageUrl = '';
        let publicId = req.file.filename;
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        const cloudinaryUrl = process.env.CLOUDINARY_URL;
        const hasCloudinary = Boolean(cloudinaryUrl ||
            (cloudName && cloudName !== 'demo' && apiKey && apiKey !== '894676451677351' && apiSecret));
        if (hasCloudinary) {
            try {
                if (cloudinaryUrl) {
                    cloudinary_1.v2.config({ cloudinary_url: cloudinaryUrl });
                }
                else {
                    cloudinary_1.v2.config({
                        cloud_name: cloudName,
                        api_key: apiKey,
                        api_secret: apiSecret,
                    });
                }
                const cloudResult = await cloudinary_1.v2.uploader.upload(req.file.path, {
                    folder: 'vetnova'
                });
                imageUrl = cloudResult.secure_url || cloudResult.url;
                publicId = cloudResult.public_id;
                // Clean up local temp file after Cloudinary upload
                if (req.file.path && fs_1.default.existsSync(req.file.path)) {
                    fs_1.default.unlink(req.file.path, () => { });
                }
            }
            catch (cloudErr) {
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
            const media = new Media_1.Media({
                filename: req.file.originalname || req.file.filename,
                url: imageUrl,
                public_id: publicId,
                format: req.file.mimetype,
                size: req.file.size
            });
            mediaObj = await media.save();
        }
        catch (mediaErr) {
            console.warn('Could not save Media record in database, returning image URL:', mediaErr);
        }
        return res.status(200).json({
            success: true,
            url: imageUrl,
            media: mediaObj
        });
    }
    catch (error) {
        console.error('Error in upload route handler:', error);
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
            return res.status(404).json({ success: false, message: 'Media not found' });
        if (media.public_id && !media.public_id.includes('.')) {
            try {
                await cloudinary_1.v2.uploader.destroy(media.public_id);
            }
            catch (e) {
                // ignore Cloudinary delete errors if unconfigured
            }
        }
        await media.deleteOne();
        res.json({ success: true, message: 'Media deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error?.message });
    }
});
exports.default = router;
//# sourceMappingURL=uploadRoutes.js.map