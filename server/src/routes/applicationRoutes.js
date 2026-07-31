"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const applicationController_1 = require("../controllers/applicationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/')
    .get(authMiddleware_1.protect, authMiddleware_1.admin, applicationController_1.getApplications) // Protected
    .post(applicationController_1.createApplication); // Public
router.route('/:id')
    .get(authMiddleware_1.protect, authMiddleware_1.admin, applicationController_1.getApplicationById)
    .put(authMiddleware_1.protect, authMiddleware_1.admin, applicationController_1.updateApplication)
    .delete(authMiddleware_1.protect, authMiddleware_1.admin, applicationController_1.deleteApplication);
exports.default = router;
//# sourceMappingURL=applicationRoutes.js.map