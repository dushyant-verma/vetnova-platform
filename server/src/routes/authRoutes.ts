import express from 'express';
import { authUser, registerUser, getMe, refreshToken, verifyToken } from '../controllers/authController';
import { protect, superAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/login', authUser);
router.post('/register', protect, superAdmin, registerUser);
router.get('/me', protect, getMe);
router.post('/refresh', protect, refreshToken);
router.get('/verify', protect, verifyToken);

export default router;
