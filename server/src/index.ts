import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';

import { connectDB } from './config/db';
import { isCloudinaryConfigured } from './config/cloudinaryConfig';

import authRoutes from './routes/authRoutes';
import programRoutes from './routes/programRoutes';
import uploadRoutes from './routes/uploadRoutes';
import statsRoutes from './routes/statsRoutes';
import footerRoutes from './routes/footerRoutes';
import enquiryRoutes from './routes/enquiryRoutes';
import { generateRouter } from './utils/generateRouter';
import { crudFactory } from './utils/crudFactory';

import { Expert } from './models/Expert';
import { AdvisoryBoard } from './models/AdvisoryBoard';
import { BlogCategory } from './models/BlogCategory';
import { Event } from './models/Event';
import { Blog } from './models/Blog';
import { Application } from './models/Application';
import { User } from './models/User';
import { Testimonial } from './models/Testimonial';
import { Gallery } from './models/Gallery';
import { Page } from './models/Page';
import { Setting } from './models/Setting';
import { Media } from './models/Media';
import { Batch } from './models/Batch';

dotenv.config();

// Environment & Secret Verification
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('[CRITICAL SECURITY FATAL] JWT_SECRET is not defined in environment variables!');
  process.exit(1);
}

const app = express();

// Trust reverse proxy for accurate IP resolution on Render/Vercel
app.set('trust proxy', 1);

// Security Headers via Helmet
app.use(helmet({
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
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Express 5 Compatible NoSQL Operator Sanitizer (removes $ keys from body/params/query objects)
const sanitizeNoSqlOperators = (target: any) => {
  if (!target || typeof target !== 'object') return;
  for (const key of Object.keys(target)) {
    if (key.startsWith('$')) {
      delete target[key];
    } else if (typeof target[key] === 'object' && target[key] !== null) {
      sanitizeNoSqlOperators(target[key]);
    }
  }
};

app.use((req, res, next) => {
  if (req.body) sanitizeNoSqlOperators(req.body);
  if (req.params) sanitizeNoSqlOperators(req.params);
  next();
});

// Connect Database
connectDB();

// Storage Startup Validation
const isCloudinaryActive = isCloudinaryConfigured();
console.log(`[Storage] Cloudinary configured: ${isCloudinaryActive}`);

// Trusted Origins Configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://vetnova-platform.vercel.app',
  'https://vetnova.in',
  'https://www.vetnova.in',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
  'http://localhost:5500',
  'http://localhost:5501',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:5501'
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      callback(null, origin || true);
    } else {
      callback(new Error('CORS policy violation: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Rate Limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 login attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' }
});

const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 enquiry submissions per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many enquiry submissions from this IP. Please try again later.' }
});

// Routes
app.use('/api/auth', (req, res, next) => {
  if (req.path === '/login' && req.method === 'POST') {
    return authLimiter(req, res, next);
  }
  next();
}, authRoutes);
app.use('/api/enquiries', (req, res, next) => {
  if (req.method === 'POST') return enquiryLimiter(req, res, next);
  next();
}, enquiryRoutes);

app.use('/api/programs', programRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/settings/footer', footerRoutes);

// Dynamic Protected & Public Routes Matrix
app.use('/api/experts', generateRouter(Expert));
app.use('/api/faculty', generateRouter(Expert));
app.use('/api/advisory-board', generateRouter(AdvisoryBoard));
app.use('/api/categories', generateRouter(BlogCategory));
app.use('/api/blog-categories', generateRouter(BlogCategory));
app.use('/api/events', generateRouter(Event));
app.use('/api/blogs', generateRouter(Blog));
app.use('/api/batches', generateRouter(Batch));

const applicationCrud = crudFactory(Application, 'program');
app.post('/api/applications', applicationCrud.createOne);
app.use('/api/applications', generateRouter(Application, 'program'));

app.use('/api/users', generateRouter(User));
app.use('/api/testimonials', generateRouter(Testimonial));
app.use('/api/gallery', generateRouter(Gallery));
app.use('/api/pages', generateRouter(Page));
app.get('/api/settings/public', async (req, res) => {
  try {
    const globalSetting = await Setting.findOne({ key: 'global' });
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch public settings' });
  }
});

app.use('/api/settings', generateRouter(Setting));
app.use('/api/media', generateRouter(Media));
app.use('/api/stats', statsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running smoothly' });
});

// Production Centralized Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
