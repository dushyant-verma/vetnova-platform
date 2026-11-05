import express from 'express';
import { crudFactory } from '../utils/crudFactory';
import { protect, admin, superAdmin } from '../middlewares/authMiddleware';

export const generateRouter = (model: any, populateOpts?: any) => {
  const router = express.Router();
  const controller = crudFactory(model, populateOpts);
  const modelName = model.modelName;

  // Determine sensitive models requiring full protection
  const isSuperAdminOnlyModel = modelName === 'User';
  const isPrivateAdminModel = ['Application', 'Media', 'Setting'].includes(modelName);

  if (isSuperAdminOnlyModel) {
    // User route management requires Super Admin
    router.route('/')
      .get(protect, superAdmin, controller.getAll)
      .post(protect, superAdmin, controller.createOne);

    router.route('/:id')
      .get(protect, superAdmin, controller.getOne)
      .put(protect, superAdmin, controller.updateOne)
      .patch(protect, superAdmin, controller.updateOne)
      .delete(protect, superAdmin, controller.deleteOne);
  } else if (isPrivateAdminModel) {
    // Private admin resources require Admin/Super Admin for all operations
    router.route('/')
      .get(protect, admin, controller.getAll)
      .post(protect, admin, controller.createOne);

    router.route('/:id')
      .get(protect, admin, controller.getOne)
      .put(protect, admin, controller.updateOne)
      .patch(protect, admin, controller.updateOne)
      .delete(protect, admin, controller.deleteOne);
  } else {
    // Publicly viewable content models (Blog, Expert, AdvisoryBoard, etc.)
    router.route('/')
      .get(controller.getAll)
      .post(protect, admin, controller.createOne);

    router.route('/:id')
      .get(controller.getOne)
      .put(protect, admin, controller.updateOne)
      .patch(protect, admin, controller.updateOne)
      .delete(protect, admin, controller.deleteOne);
  }

  return router;
};
