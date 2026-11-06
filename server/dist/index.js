"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./config/db");
const cloudinaryConfig_1 = require("./config/cloudinaryConfig");
const initAdmin_1 = require("./utils/initAdmin");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const programRoutes_1 = __importDefault(require("./routes/programRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const statsRoutes_1 = __importDefault(require("./routes/statsRoutes"));
const footerRoutes_1 = __importDefault(require("./routes/footerRoutes"));
const enquiryRoutes_1 = __importDefault(require("./routes/enquiryRoutes"));
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
const Batch_1 = require("./models/Batch");
dotenv_1.default.config();
// Environment & Secret Verification
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    console.error('[CRITICAL SECURITY FATAL] JWT_SECRET is not defined in environment variables!');
    process.exit(1);
}
const app = (0, express_1.default)();
// Trust reverse proxy for accurate IP resolution on Render/Vercel
app.set('trust proxy', 1);
// Production & Development CORS Configuration
const configuredOrigins = [
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGIN,
    'https://vetnova-platform.vercel.app',
    'https://vetnova.in',
    'https://www.vetnova.in',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:3000',
    'http://localhost:5500',
    'http://localhost:5501',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:4173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5501'
]
    .filter(Boolean)
    .map(url => String(url).trim().replace(/\/+$/, '').toLowerCase());
const isOriginAllowed = (origin) => {
    if (!origin)
        return true; // Server-to-server, mobile clients, curl, Postman
    const clean = origin.trim().replace(/\/+$/, '').toLowerCase();
    // 1. Direct match with configured origins
    if (configuredOrigins.includes(clean)) {
        return true;
    }
    // 2. Allow all localhost & 127.0.0.1 loopbacks on any port
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(clean)) {
        return true;
    }
    // 3. Allow Vercel production & preview deployment URLs for VetNova platform
    if (/^https:\/\/vetnova-platform(-[a-z0-9-]+)?\.vercel\.app$/.test(clean)) {
        return true;
    }
    // 4. Allow official VetNova custom domain (and subdomains)
    if (/^https:\/\/([a-z0-9-]+\.)?vetnova\.in$/.test(clean)) {
        return true;
    }
    return false;
};
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || isOriginAllowed(origin)) {
            callback(null, true);
        }
        else {
            console.warn(`[CORS Blocked] Origin not allowed: ${origin}`);
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Authorization', 'Content-Range', 'X-Content-Range'],
    maxAge: 86400,
    optionsSuccessStatus: 204
};
// 1. Register CORS before all routes and body parsers
app.use((0, cors_1.default)(corsOptions));
// 2. Explicitly handle preflight OPTIONS requests early
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});
// Security Headers via Helmet
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com", "https://*.cloudinary.com"],
            connectSrc: ["'self'", "https://api.cloudinary.com", "https://*.render.com", "https://*.vercel.app"],
            frameAncestors: ["'self'"],
            objectSrc: ["'none'"]
        }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// Request Body Parsers
app.use(express_1.default.json({ limit: '5mb' }));
app.use(express_1.default.urlencoded({ limit: '5mb', extended: true }));
// Express 5 Compatible NoSQL Operator Sanitizer (removes $ keys from body/params/query objects)
const sanitizeNoSqlOperators = (target) => {
    if (!target || typeof target !== 'object')
        return;
    for (const key of Object.keys(target)) {
        if (key.startsWith('$')) {
            delete target[key];
        }
        else if (typeof target[key] === 'object' && target[key] !== null) {
            sanitizeNoSqlOperators(target[key]);
        }
    }
};
app.use((req, res, next) => {
    if (req.body)
        sanitizeNoSqlOperators(req.body);
    if (req.params)
        sanitizeNoSqlOperators(req.params);
    next();
});
// Connect Database & Initialize Administrative Bootstrap
(0, db_1.connectDB)().then(async () => {
    await (0, initAdmin_1.ensureSuperAdminExists)();
}).catch((err) => {
    console.error('[Startup Error] Database connection or init failed:', err.message || err);
});
// Storage Startup Validation
const isCloudinaryActive = (0, cloudinaryConfig_1.isCloudinaryConfigured)();
console.log(`[Storage] Cloudinary configured: ${isCloudinaryActive}`);
// Rate Limiters
const globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // 300 requests per IP per window
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS',
    message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', globalLimiter);
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10, // 10 login attempts per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS',
    message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' }
});
const enquiryLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 30, // 30 enquiry submissions per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS',
    message: { success: false, message: 'Too many enquiry submissions from this IP. Please try again later.' }
});
// Routes
app.use('/api/auth', (req, res, next) => {
    if (req.path === '/login' && req.method === 'POST') {
        return authLimiter(req, res, next);
    }
    next();
}, authRoutes_1.default);
app.use('/api/enquiries', (req, res, next) => {
    if (req.method === 'POST')
        return enquiryLimiter(req, res, next);
    next();
}, enquiryRoutes_1.default);
app.use('/api/programs', programRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/api/settings/footer', footerRoutes_1.default);
// Dynamic Protected & Public Routes Matrix
app.use('/api/experts', (0, generateRouter_1.generateRouter)(Expert_1.Expert));
app.use('/api/faculty', (0, generateRouter_1.generateRouter)(Expert_1.Expert));
app.use('/api/advisory-board', (0, generateRouter_1.generateRouter)(AdvisoryBoard_1.AdvisoryBoard));
app.use('/api/categories', (0, generateRouter_1.generateRouter)(BlogCategory_1.BlogCategory));
app.use('/api/blog-categories', (0, generateRouter_1.generateRouter)(BlogCategory_1.BlogCategory));
app.use('/api/events', (0, generateRouter_1.generateRouter)(Event_1.Event));
app.use('/api/blogs', (0, generateRouter_1.generateRouter)(Blog_1.Blog));
app.use('/api/batches', (0, generateRouter_1.generateRouter)(Batch_1.Batch));
const applicationCrud = (0, crudFactory_1.crudFactory)(Application_1.Application, 'program');
app.post('/api/applications', applicationCrud.createOne);
app.use('/api/applications', (0, generateRouter_1.generateRouter)(Application_1.Application, 'program'));
app.use('/api/users', (0, generateRouter_1.generateRouter)(User_1.User));
app.use('/api/testimonials', (0, generateRouter_1.generateRouter)(Testimonial_1.Testimonial));
app.use('/api/gallery', (0, generateRouter_1.generateRouter)(Gallery_1.Gallery));
app.use('/api/pages', (0, generateRouter_1.generateRouter)(Page_1.Page));
app.get('/api/settings/public', async (req, res) => {
    try {
        const globalSetting = await Setting_1.Setting.findOne({ key: 'global' });
        const contactPhone = globalSetting?.value?.contactPhone || '+91 92725 61089';
        const contactEmail = globalSetting?.value?.contactEmail || 'contact@vetnovainstitute.com';
        const digits = contactPhone.replace(/[^0-9]/g, '');
        const localPhone = digits.slice(-10) || '9272561089';
        res.json({
            contactPhone,
            contactPhoneLocal: localPhone,
            contactPhoneTel: `tel:+91${localPhone}`,
            whatsappUrl: `https://wa.me/91${localPhone}`,
            contactEmail,
            address: globalSetting?.value?.address || 'Wagholi, Pune, Maharashtra 412207'
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch public settings' });
    }
});
app.use('/api/settings', (0, generateRouter_1.generateRouter)(Setting_1.Setting));
app.use('/api/media', (0, generateRouter_1.generateRouter)(Media_1.Media));
app.use('/api/stats', statsRoutes_1.default);
app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running smoothly' });
});
// Production Centralized Error Handler
app.use((err, req, res, next) => {
    console.error('[Server Error Handler]:', err.message || err);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({
        success: false,
        message: status === 500 ? 'Internal Server Error' : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`[Server] Production-hardened server listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map