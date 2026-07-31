import express from 'express';
import { getPrograms, getProgramById, createProgram, updateProgram, deleteProgram } from '../controllers/programController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/').get(getPrograms).post(protect, admin, createProgram);
router.route('/:id').get(getProgramById).put(protect, admin, updateProgram).delete(protect, admin, deleteProgram);

export default router;
