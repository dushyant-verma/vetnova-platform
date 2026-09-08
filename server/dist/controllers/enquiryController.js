"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEnquiry = exports.updateEnquiry = exports.getEnquiryById = exports.getEnquiries = exports.createEnquiry = void 0;
const Enquiry_1 = require("../models/Enquiry");
// Email regex pattern
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
// Basic phone regex pattern supporting international formats (5-20 characters: digits, +, -, space, brackets)
const PHONE_REGEX = /^[+\d\s\-()]{5,20}$/;
/**
 * @desc    Create a new Enquiry (Public submission)
 * @route   POST /api/enquiries
 * @access  Public
 */
const createEnquiry = async (req, res) => {
    try {
        const { name, countryCode, phone, email, profile, course, message, source, sourcePage } = req.body;
        // Validation
        const trimmedName = typeof name === 'string' ? name.trim() : '';
        const trimmedEmail = typeof email === 'string' ? email.trim() : '';
        const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';
        const trimmedCountryCode = typeof countryCode === 'string' ? countryCode.trim() : '';
        if (!trimmedName) {
            res.status(400).json({ success: false, message: 'Full Name is required' });
            return;
        }
        if (!trimmedPhone) {
            res.status(400).json({ success: false, message: 'Phone Number is required' });
            return;
        }
        if (!PHONE_REGEX.test(trimmedPhone)) {
            res.status(400).json({ success: false, message: 'Please provide a valid phone number' });
            return;
        }
        if (!trimmedEmail) {
            res.status(400).json({ success: false, message: 'Email Address is required' });
            return;
        }
        if (!EMAIL_REGEX.test(trimmedEmail)) {
            res.status(400).json({ success: false, message: 'Please provide a valid email address' });
            return;
        }
        // Sanitize lengths
        const safeMessage = typeof message === 'string' ? message.trim().slice(0, 2000) : '';
        const safeProfile = typeof profile === 'string' ? profile.trim().slice(0, 100) : '';
        const safeCourse = typeof course === 'string' ? course.trim().slice(0, 150) : '';
        const safeSource = typeof source === 'string' && source.trim() ? source.trim().slice(0, 100) : 'website';
        const safeSourcePage = typeof sourcePage === 'string' ? sourcePage.trim().slice(0, 300) : '';
        const enquiry = await Enquiry_1.Enquiry.create({
            name: trimmedName.slice(0, 100),
            countryCode: trimmedCountryCode.slice(0, 10),
            phone: trimmedPhone,
            email: trimmedEmail.slice(0, 100),
            profile: safeProfile,
            course: safeCourse,
            message: safeMessage,
            source: safeSource,
            sourcePage: safeSourcePage,
            status: 'New'
        });
        res.status(201).json({
            success: true,
            message: 'Enquiry submitted successfully',
            data: enquiry
        });
    }
    catch (error) {
        console.error('Error creating enquiry:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to submit enquiry. Please try again later.'
        });
    }
};
exports.createEnquiry = createEnquiry;
/**
 * @desc    Get all Enquiries with search, filter, and pagination
 * @route   GET /api/enquiries
 * @access  Private/Admin
 */
const getEnquiries = async (req, res) => {
    try {
        const { search, status, course, page = '1', limit = '20' } = req.query;
        const query = {};
        // Filter by Status
        if (status && status !== 'all') {
            query.status = { $regex: new RegExp(`^${status}$`, 'i') };
        }
        // Filter by Course
        if (course && course !== 'all') {
            query.course = { $regex: new RegExp(String(course), 'i') };
        }
        // Search term across fields
        if (search) {
            const searchRegex = new RegExp(String(search), 'i');
            query.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { phone: searchRegex },
                { profile: searchRegex },
                { course: searchRegex },
                { message: searchRegex },
                { source: searchRegex },
                { sourcePage: searchRegex }
            ];
        }
        const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 20));
        const skip = (pageNum - 1) * limitNum;
        const total = await Enquiry_1.Enquiry.countDocuments(query);
        const enquiries = await Enquiry_1.Enquiry.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);
        res.json({
            success: true,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
            data: enquiries
        });
    }
    catch (error) {
        console.error('Error fetching enquiries:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching enquiries' });
    }
};
exports.getEnquiries = getEnquiries;
/**
 * @desc    Get single Enquiry by ID
 * @route   GET /api/enquiries/:id
 * @access  Private/Admin
 */
const getEnquiryById = async (req, res) => {
    try {
        const enquiry = await Enquiry_1.Enquiry.findById(req.params.id);
        if (!enquiry) {
            res.status(404).json({ success: false, message: 'Enquiry not found' });
            return;
        }
        res.json({ success: true, data: enquiry });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching enquiry details' });
    }
};
exports.getEnquiryById = getEnquiryById;
/**
 * @desc    Update Enquiry (e.g., status, notes)
 * @route   PATCH /api/enquiries/:id or PUT /api/enquiries/:id
 * @access  Private/Admin
 */
const updateEnquiry = async (req, res) => {
    try {
        const { status, name, phone, email, profile, course, message, source, sourcePage } = req.body;
        const enquiry = await Enquiry_1.Enquiry.findById(req.params.id);
        if (!enquiry) {
            res.status(404).json({ success: false, message: 'Enquiry not found' });
            return;
        }
        if (status) {
            const validStatuses = ['New', 'Contacted', 'Converted', 'Closed'];
            if (!validStatuses.includes(status)) {
                res.status(400).json({ success: false, message: `Invalid status. Must be one of ${validStatuses.join(', ')}` });
                return;
            }
            enquiry.status = status;
        }
        if (name !== undefined)
            enquiry.name = String(name).trim();
        if (phone !== undefined)
            enquiry.phone = String(phone).trim();
        if (email !== undefined)
            enquiry.email = String(email).trim().toLowerCase();
        if (profile !== undefined)
            enquiry.profile = String(profile).trim();
        if (course !== undefined)
            enquiry.course = String(course).trim();
        if (message !== undefined)
            enquiry.message = String(message).trim();
        if (source !== undefined)
            enquiry.source = String(source).trim();
        if (sourcePage !== undefined)
            enquiry.sourcePage = String(sourcePage).trim();
        const updatedEnquiry = await enquiry.save();
        res.json({
            success: true,
            message: 'Enquiry updated successfully',
            data: updatedEnquiry
        });
    }
    catch (error) {
        console.error('Error updating enquiry:', error);
        res.status(400).json({ success: false, message: error.message || 'Error updating enquiry' });
    }
};
exports.updateEnquiry = updateEnquiry;
/**
 * @desc    Delete Enquiry
 * @route   DELETE /api/enquiries/:id
 * @access  Private/Admin
 */
const deleteEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry_1.Enquiry.findByIdAndDelete(req.params.id);
        if (!enquiry) {
            res.status(404).json({ success: false, message: 'Enquiry not found' });
            return;
        }
        res.json({ success: true, message: 'Enquiry removed successfully' });
    }
    catch (error) {
        console.error('Error deleting enquiry:', error);
        res.status(500).json({ success: false, message: 'Error deleting enquiry' });
    }
};
exports.deleteEnquiry = deleteEnquiry;
//# sourceMappingURL=enquiryController.js.map