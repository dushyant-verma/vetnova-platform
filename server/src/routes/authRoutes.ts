import express from 'express';
import { authUser, registerUser } from '../controllers/authController';
import { protect, superAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/login', authUser);
router.post('/register', protect, superAdmin, registerUser);

export default router;
