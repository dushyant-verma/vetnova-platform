"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const cloudinaryConfig_1 = require("./config/cloudinaryConfig");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const programRoutes_1 = __importDefault(require("./routes/programRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const statsRoutes_1 = __importDefault(require("./routes/statsRoutes"));
const footerRoutes_1 = __importDefault(require("./routes/footerRoutes"));
const generateRouter_1 = require("./utils/generateRouter");
const crudFactory_1 = require("./utils/crudFactory");
const Expert_1 = require("./models/Expert");
const AdvisoryBoard_1 = require("./models/AdvisoryBoard");
const BlogCategory_1 = require("./models/BlogCategory");
const Event_1 = require("./models/Event");
const Blog_1 = require("./models/Blog");
const Application_1 = require("./models/Application");
const User_1 = require("./models/User");
const Testimonial_1 = require("./models/Testimonial");
const Gallery_1 = require("./models/Gallery");
const Page_1 = require("./models/Page");
const Setting_1 = require("./models/Setting");
const Media_1 = require("./models/Media");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Connect Database
(0, db_1.connectDB)();
// Storage Startup Validation
const isCloudinaryActive = (0, cloudinaryConfig_1.isCloudinaryConfigured)();
console.log(`[Storage] Cloudinary configured: ${isCloudinaryActive}`);
if (isCloudinaryActive) {
    console.log('[Storage] Permanent production media storage ENABLED');
}
else {
    console.warn('[Storage WARNING] Cloudinary configuration missing or invalid. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET');
}
// CORS Middleware Configuration
const allowedOrigins = [
    process.env.CLIENT_URL || 'https://vetnova-platform.vercel.app',
    'https://vetnova-platform.vercel.app',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:3000'
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin || true);
        }
        else {
            callback(null, origin || true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/programs', programRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
app.use('/api/settings/footer', footerRoutes_1.default);
// Dynamic Generic Routes
app.use('/api/experts', (0, generateRouter_1.generateRouter)(Expert_1.Expert));
app.use('/api/faculty', (0, generateRouter_1.generateRouter)(Expert_1.Expert));
app.use('/api/advisory-board', (0, generateRouter_1.generateRouter)(AdvisoryBoard_1.AdvisoryBoard));
app.use('/api/categories', (0, generateRouter_1.generateRouter)(BlogCategory_1.BlogCategory));
app.use('/api/blog-categories', (0, generateRouter_1.generateRouter)(BlogCategory_1.BlogCategory));
app.use('/api/events', (0, generateRouter_1.generateRouter)(Event_1.Event));
app.use('/api/blogs', (0, generateRouter_1.generateRouter)(Blog_1.Blog));
const applicationCrud = (0, crudFactory_1.crudFactory)(Application_1.Application, 'program');
app.post('/api/applications', applicationCrud.createOne);
app.use('/api/applications', (0, generateRouter_1.generateRouter)(Application_1.Application, 'program'));
app.use('/api/users', (0, generateRouter_1.generateRouter)(User_1.User));
app.use('/api/testimonials', (0, generateRouter_1.generateRouter)(Testimonial_1.Testimonial));
app.use('/api/gallery', (0, generateRouter_1.generateRouter)(Gallery_1.Gallery));
app.use('/api/pages', (0, generateRouter_1.generateRouter)(Page_1.Page));
app.use('/api/settings', (0, generateRouter_1.generateRouter)(Setting_1.Setting));
app.use('/api/media', (0, generateRouter_1.generateRouter)(Media_1.Media));
app.use('/api/stats', statsRoutes_1.default);
app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running' });
});
app.get('/api/health/storage', (req, res) => {
    const configured = (0, cloudinaryConfig_1.isCloudinaryConfigured)();
    res.json({
        storage: 'cloudinary',
        persistent: configured,
        configured: configured
    });
});
// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    const origin = req.headers.origin;
    if (origin && typeof origin === 'string') {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    res.status(err.status || err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: err.stack || String(err)
    });
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map