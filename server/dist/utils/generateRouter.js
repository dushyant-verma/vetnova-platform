"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRouter = void 0;
const express_1 = __importDefault(require("express"));
const crudFactory_1 = require("../utils/crudFactory");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const generateRouter = (model, populateOpts) => {
    const router = express_1.default.Router();
    const controller = (0, crudFactory_1.crudFactory)(model, populateOpts);
    const modelName = model.modelName;
    // Determine sensitive models requiring full protection
    const isSuperAdminOnlyModel = modelName === 'User';
    const isPrivateAdminModel = ['Application', 'Media', 'Setting'].includes(modelName);
    if (isSuperAdminOnlyModel) {
        // User route management requires Super Admin
        router.route('/')
            .get(authMiddleware_1.protect, authMiddleware_1.superAdmin, controller.getAll)
            .post(authMiddleware_1.protect, authMiddleware_1.superAdmin, controller.createOne);
        router.route('/:id')
            .get(authMiddleware_1.protect, authMiddleware_1.superAdmin, controller.getOne)
            .put(authMiddleware_1.protect, authMiddleware_1.superAdmin, controller.updateOne)
            .patch(authMiddleware_1.protect, authMiddleware_1.superAdmin, controller.updateOne)
            .delete(authMiddleware_1.protect, authMiddleware_1.superAdmin, controller.deleteOne);
    }
    else if (isPrivateAdminModel) {
        // Private admin resources require Admin/Super Admin for all operations
        router.route('/')
            .get(authMiddleware_1.protect, authMiddleware_1.admin, controller.getAll)
            .post(authMiddleware_1.protect, authMiddleware_1.admin, controller.createOne);
        router.route('/:id')
            .get(authMiddleware_1.protect, authMiddleware_1.admin, controller.getOne)
            .put(authMiddleware_1.protect, authMiddleware_1.admin, controller.updateOne)
            .patch(authMiddleware_1.protect, authMiddleware_1.admin, controller.updateOne)
            .delete(authMiddleware_1.protect, authMiddleware_1.admin, controller.deleteOne);
    }
    else {
        // Publicly viewable content models (Blog, Expert, AdvisoryBoard, etc.)
        router.route('/')
            .get(controller.getAll)
            .post(authMiddleware_1.protect, authMiddleware_1.admin, controller.createOne);
        router.route('/:id')
            .get(controller.getOne)
            .put(authMiddleware_1.protect, authMiddleware_1.admin, controller.updateOne)
            .patch(authMiddleware_1.protect, authMiddleware_1.admin, controller.updateOne)
            .delete(authMiddleware_1.protect, authMiddleware_1.admin, controller.deleteOne);
    }
    return router;
};
exports.generateRouter = generateRouter;
//# sourceMappingURL=generateRouter.js.map