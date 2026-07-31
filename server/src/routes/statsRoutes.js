"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Program_1 = require("../models/Program");
const Application_1 = require("../models/Application");
const User_1 = require("../models/User");
const Expert_1 = require("../models/Expert");
const Event_1 = require("../models/Event");
const Blog_1 = require("../models/Blog");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.protect, authMiddleware_1.admin, async (req, res) => {
    try {
        const [programsCount, applicationsCount, usersCount, expertsCount, eventsCount, blogsCount] = await Promise.all([
            Program_1.Program.countDocuments(),
            Application_1.Application.countDocuments(),
            User_1.User.countDocuments(),
            Expert_1.Expert.countDocuments(),
            Event_1.Event.countDocuments(),
            Blog_1.Blog.countDocuments()
        ]);
        res.json({
            programsCount,
            applicationsCount,
            usersCount,
            expertsCount,
            eventsCount,
            blogsCount
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
});
exports.default = router;
//# sourceMappingURL=statsRoutes.js.map