"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enquiryController_1 = require("../controllers/enquiryController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Public submission route
router.post('/', enquiryController_1.createEnquiry);
// Protected Admin management routes
router.get('/', authMiddleware_1.protect, authMiddleware_1.admin, enquiryController_1.getEnquiries);
router.get('/:id', authMiddleware_1.protect, authMiddleware_1.admin, enquiryController_1.getEnquiryById);
router.patch('/:id', authMiddleware_1.protect, authMiddleware_1.admin, enquiryController_1.updateEnquiry);
router.put('/:id', authMiddleware_1.protect, authMiddleware_1.admin, enquiryController_1.updateEnquiry);
router.delete('/:id', authMiddleware_1.protect, authMiddleware_1.admin, enquiryController_1.deleteEnquiry);
exports.default = router;
//# sourceMappingURL=enquiryRoutes.js.map