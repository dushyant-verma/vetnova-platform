"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("cloudinary");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const Media_1 = require("../models/Media");
const router = express_1.default.Router();
// Ensure local uploads directory exists
const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Disk storage for local static file serving
const localStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname) || '.webp';
        cb(null, `file-${uniqueSuffix}${ext}`);
    }
});
const upload = (0, multer_1.default)({
    storage: localStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit matching CRM UI
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files (PNG, JPG, WEBP) are allowed!'));
        }
    }
});
router.post('/', authMiddleware_1.protect, authMiddleware_1.admin, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            if (err instanceof multer_1.default.MulterError && err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File size must be less than 5MB' });
            }
            return res.status(400).json({ message: err.message || 'Image upload failed' });
        }
        next();
    });
}, async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
        let imageUrl = '';
        let publicId = req.file.filename;
        const hasCloudinary = Boolean(process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_CLOUD_NAME !== 'demo' &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_KEY !== '894676451677351');
        if (hasCloudinary) {
            try {
                cloudinary_1.v2.config({
                    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET,
                });
                const cloudResult = await cloudinary_1.v2.uploader.upload(req.file.path, {
                    folder: 'vetnova'
                });
                imageUrl = cloudResult.secure_url || cloudResult.url;
                publicId = cloudResult.public_id;
                // Clean up local temp file after uploading to Cloudinary
                fs_1.default.unlink(req.file.path, () => { });
            }
            catch (cloudErr) {
                console.warn('Cloudinary upload failed, using local server URL fallback:', cloudErr);
            }
        }
        if (!imageUrl) {
            // Local static HTTP URL
            const host = req.get('host');
            const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
            imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        }
        const media = new Media_1.Media({
            filename: req.file.originalname,
            url: imageUrl,
            public_id: publicId,
            format: req.file.mimetype,
            size: req.file.size
        });
        await media.save();
        res.json({ url: imageUrl, media });
    }
    catch (error) {
        console.error('Error in upload route:', error);
        res.status(500).json({ message: 'Error processing media upload' });
    }
});
router.delete('/:id', authMiddleware_1.protect, authMiddleware_1.admin, async (req, res) => {
    try {
        const media = await Media_1.Media.findById(req.params.id);
        if (!media)
            return res.status(404).json({ message: 'Media not found' });
        if (media.public_id && !media.public_id.includes('.')) {
            try {
                await cloudinary_1.v2.uploader.destroy(media.public_id);
            }
            catch (e) {
                // ignore Cloudinary delete errors if unconfigured
            }
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