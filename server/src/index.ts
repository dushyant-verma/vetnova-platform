import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import { isCloudinaryConfigured } from './config/cloudinaryConfig';

import authRoutes from './routes/authRoutes';
import programRoutes from './routes/programRoutes';
import uploadRoutes from './routes/uploadRoutes';
import statsRoutes from './routes/statsRoutes';
import footerRoutes from './routes/footerRoutes';
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

import path from 'path';

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Storage Startup Validation
const isCloudinaryActive = isCloudinaryConfigured();
console.log(`[Storage] Cloudinary configured: ${isCloudinaryActive}`);
if (isCloudinaryActive) {
  console.log('[Storage] Permanent production media storage ENABLED');
} else {
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

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin || true);
    } else {
      callback(null, origin || true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings/footer', footerRoutes);

// Dynamic Generic Routes
app.use('/api/experts', generateRouter(Expert));
app.use('/api/faculty', generateRouter(Expert));
app.use('/api/advisory-board', generateRouter(AdvisoryBoard));
app.use('/api/categories', generateRouter(BlogCategory));
app.use('/api/blog-categories', generateRouter(BlogCategory));
app.use('/api/events', generateRouter(Event));
app.use('/api/blogs', generateRouter(Blog));
const applicationCrud = crudFactory(Application, 'program');
app.post('/api/applications', applicationCrud.createOne);
app.use('/api/applications', generateRouter(Application, 'program'));
app.use('/api/users', generateRouter(User));
app.use('/api/testimonials', generateRouter(Testimonial));
app.use('/api/gallery', generateRouter(Gallery));
app.use('/api/pages', generateRouter(Page));
app.use('/api/settings', generateRouter(Setting));
app.use('/api/media', generateRouter(Media));
app.use('/api/stats', statsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

app.get('/api/health/storage', (req, res) => {
  const configured = isCloudinaryConfigured();
  res.json({
    storage: 'cloudinary',
    persistent: configured,
    configured: configured
  });
});

// Global Error Handler Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
