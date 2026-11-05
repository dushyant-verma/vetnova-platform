import { Router } from 'express';
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
  addEnquiryNote,
  exportEnquiriesCSV
} from '../controllers/enquiryController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = Router();

// Public submission route
router.post('/', createEnquiry);

// Protected Admin management routes
router.get('/export/csv', protect, admin, exportEnquiriesCSV);
router.get('/', protect, admin, getEnquiries);
router.get('/:id', protect, admin, getEnquiryById);
router.patch('/:id', protect, admin, updateEnquiry);
router.put('/:id', protect, admin, updateEnquiry);
router.post('/:id/notes', protect, admin, addEnquiryNote);
router.delete('/:id', protect, admin, deleteEnquiry);

export default router;
