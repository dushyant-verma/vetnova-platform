import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';

import authRoutes from './routes/authRoutes';
import programRoutes from './routes/programRoutes';
import uploadRoutes from './routes/uploadRoutes';
import statsRoutes from './routes/statsRoutes';
import footerRoutes from './routes/footerRoutes';
import { generateRouter } from './utils/generateRouter';
import { crudFactory } from './utils/crudFactory';

import { Expert } from './models/Expert';
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

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings/footer', footerRoutes);

// Dynamic Generic Routes
app.use('/api/experts', generateRouter(Expert));
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

// Global Error Handler Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
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
