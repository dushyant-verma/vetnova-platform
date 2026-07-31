"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const FooterSetting_1 = require("../models/FooterSetting");
const router = express_1.default.Router();
const defaultSettings = {
    description: "India's premier veterinary training institute connecting veterinary professionals with world-class clinical education.",
    logo: '',
    socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com' },
        { platform: 'Facebook', url: 'https://facebook.com' },
        { platform: 'Instagram', url: 'https://instagram.com' },
        { platform: 'YouTube', url: 'https://youtube.com' },
        { platform: 'X', url: 'https://twitter.com' }
    ],
    menus: [
        {
            title: 'Courses',
            links: [
                { label: 'For Veterinarians', url: '/programs?category=veterinarians' },
                { label: 'For Vet Nurses', url: '/programs?category=nurses' },
                { label: 'Certificate Programmes', url: '/programs?category=certificates' },
                { label: 'Short Courses', url: '/programs?category=short-courses' },
                { label: 'Online Modules', url: '/programs?category=online' }
            ]
        },
        {
            title: 'About',
            links: [
                { label: 'Our Story', url: '/about' },
                { label: 'Advisory Board', url: '/about#advisory-board' },
                { label: 'Trainers', url: '/faculty' },
                { label: 'Facilities', url: '/about#facilities' },
                { label: 'Events', url: '/events' }
            ]
        },
        {
            title: 'Support',
            links: [
                { label: 'Contact', url: '/contact' },
                { label: 'FAQ', url: '/faq' },
                { label: 'Student Login', url: '/admin' },
                { label: 'Trainer Portal', url: '/admin' },
                { label: 'Download Brochure', url: '#' }
            ]
        }
    ],
    copyright: '© VetNova Training Institute Pvt Ltd.',
    address: 'Pune, Maharashtra, India',
    legalLinks: [
        { label: 'Privacy Policy', url: '/privacy' },
        { label: 'Terms & Conditions', url: '/terms' },
        { label: 'Refund Policy', url: '/refund' }
    ]
};
// @route   GET /api/settings/footer
// @desc    Get footer settings
// @access  Public
router.get('/', async (req, res) => {
    try {
        let settings = await FooterSetting_1.FooterSetting.findOne();
        if (!settings) {
            settings = await FooterSetting_1.FooterSetting.create(defaultSettings);
        }
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   PUT /api/settings/footer
// @desc    Update footer settings
// @access  Private/Admin
router.put('/', authMiddleware_1.protect, authMiddleware_1.admin, async (req, res) => {
    try {
        let settings = await FooterSetting_1.FooterSetting.findOne();
        if (settings) {
            settings.description = req.body.description || settings.description;
            settings.logo = req.body.logo !== undefined ? req.body.logo : settings.logo;
            settings.socialLinks = req.body.socialLinks || settings.socialLinks;
            settings.menus = req.body.menus || settings.menus;
            settings.copyright = req.body.copyright || settings.copyright;
            settings.address = req.body.address || settings.address;
            settings.legalLinks = req.body.legalLinks || settings.legalLinks;
            const updated = await settings.save();
            res.json(updated);
        }
        else {
            const created = await FooterSetting_1.FooterSetting.create(req.body);
            res.json(created);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.default = router;
//# sourceMappingURL=footerRoutes.js.map