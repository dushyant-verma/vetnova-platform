"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expertController_1 = require("../controllers/expertController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/')
    .get(expertController_1.getExperts)
    .post(authMiddleware_1.protect, authMiddleware_1.admin, expertController_1.createExpert);
router.route('/:id')
    .get(expertController_1.getExpertById)
    .put(authMiddleware_1.protect, authMiddleware_1.admin, expertController_1.updateExpert)
    .delete(authMiddleware_1.protect, authMiddleware_1.admin, expertController_1.deleteExpert);
exports.default = router;
//# sourceMappingURL=expertRoutes.js.map