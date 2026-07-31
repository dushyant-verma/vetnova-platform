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
    router.route('/')
        .get(controller.getAll)
        .post(authMiddleware_1.protect, authMiddleware_1.admin, controller.createOne);
    router.route('/:id')
        .get(controller.getOne)
        .put(authMiddleware_1.protect, authMiddleware_1.admin, controller.updateOne)
        .delete(authMiddleware_1.protect, authMiddleware_1.admin, controller.deleteOne);
    return router;
};
exports.generateRouter = generateRouter;
//# sourceMappingURL=generateRouter.js.map