import express from 'express';
import { crudFactory } from '../utils/crudFactory';
import { protect, admin } from '../middlewares/authMiddleware';

export const generateRouter = (model: any, populateOpts?: any) => {
  const router = express.Router();
  const controller = crudFactory(model, populateOpts);

  router.route('/')
    .get(controller.getAll)
    .post(protect, admin, controller.createOne);

  router.route('/:id')
    .get(controller.getOne)
    .put(protect, admin, controller.updateOne)
    .delete(protect, admin, controller.deleteOne);

  return router;
};
