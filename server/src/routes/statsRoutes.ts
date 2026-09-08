import { Router } from 'express';
import { Program } from '../models/Program';
import { Application } from '../models/Application';
import { User } from '../models/User';
import { Expert } from '../models/Expert';
import { AdvisoryBoard } from '../models/AdvisoryBoard';
import { BlogCategory } from '../models/BlogCategory';
import { Event } from '../models/Event';
import { Blog } from '../models/Blog';
import { Enquiry } from '../models/Enquiry';
import { protect, admin } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', protect, admin, async (req, res) => {
  try {
    const [
      programsCount,
      applicationsCount,
      usersCount,
      expertsCount,
      advisoryBoardCount,
      categoriesCount,
      eventsCount,
      blogsCount,
      enquiriesCount,
      newEnquiriesCount
    ] = await Promise.all([
      Program.countDocuments(),
      Application.countDocuments(),
      User.countDocuments(),
      Expert.countDocuments(),
      AdvisoryBoard.countDocuments(),
      BlogCategory.countDocuments(),
      Event.countDocuments(),
      Blog.countDocuments(),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'New' })
    ]);

    res.json({
      programsCount,
      applicationsCount,
      usersCount,
      expertsCount,
      facultyCount: expertsCount,
      advisoryBoardCount,
      categoriesCount,
      eventsCount,
      blogsCount,
      enquiriesCount,
      newEnquiriesCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

export default router;
