import { Router } from 'express';
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry
} from '../controllers/enquiryController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = Router();

// Public submission route
router.post('/', createEnquiry);

// Protected Admin management routes
router.get('/', protect, admin, getEnquiries);
router.get('/:id', protect, admin, getEnquiryById);
router.patch('/:id', protect, admin, updateEnquiry);
router.put('/:id', protect, admin, updateEnquiry);
router.delete('/:id', protect, admin, deleteEnquiry);

export default router;
