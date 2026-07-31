import { Router } from 'express';
import { Program } from '../models/Program';
import { Application } from '../models/Application';
import { User } from '../models/User';
import { Expert } from '../models/Expert';
import { Event } from '../models/Event';
import { Blog } from '../models/Blog';
import { protect, admin } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', protect, admin, async (req, res) => {
  try {
    const [
      programsCount,
      applicationsCount,
      usersCount,
      expertsCount,
      eventsCount,
      blogsCount
    ] = await Promise.all([
      Program.countDocuments(),
      Application.countDocuments(),
      User.countDocuments(),
      Expert.countDocuments(),
      Event.countDocuments(),
      Blog.countDocuments()
    ]);

    res.json({
      programsCount,
      applicationsCount,
      usersCount,
      expertsCount,
      eventsCount,
      blogsCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

export default router;
