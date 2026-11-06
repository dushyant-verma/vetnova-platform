"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportEnquiriesCSV = exports.deleteEnquiry = exports.addEnquiryNote = exports.updateEnquiry = exports.getEnquiryById = exports.getEnquiries = exports.createEnquiry = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Enquiry_1 = require("../models/Enquiry");
const emailService_1 = require("../services/emailService");
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(?:\+?\d{1,4}[\s-]?)?(?:\d[\s-]?){7,14}\d$/;
const INDIAN_MOBILE_REGEX = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;
const escapeRegex = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};
const getParamId = (req) => {
    const rawId = req.params.id;
    return Array.isArray(rawId) ? rawId[0] : String(rawId || '');
};
const generateLeadId = () => {
    const dateStr = Date.now().toString(36).toUpperCase();
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `VN-LEAD-${dateStr}-${rand}`;
};
const THANK_YOU_MESSAGES = {
    student: {
        title: 'Thank You for Connecting with VetNova!',
        message: "Your veterinary journey deserves more than knowledge alone—it deserves the confidence to apply it. We're here to help you bridge the gap between learning and clinical practice.\n\nLet's build your skills for a confident future in veterinary care. We'll be in touch soon!"
    },
    practitioner: {
        title: 'Thank You for Connecting with VetNova!',
        message: "Every clinician has the potential to grow, advance and make a greater difference. We look forward to exploring practical learning opportunities that strengthen your skills and elevate your clinical practice.\n\nLet's take veterinary excellence forward—together. We'll be in touch soon!"
    },
    nurse: {
        title: 'Thank You for Exploring Your Journey with VetNova!',
        message: "Every skilled veterinary nurse makes a difference in an animal's life. We're excited to help you explore practical skills that turn your passion for animal care into meaningful capability.\n\nYour journey towards better animal care starts here. We'll be in touch soon!"
    },
    partner: {
        title: 'Thank You for Your Interest in Partnering with VetNova!',
        message: "Together, we can bridge the gap between veterinary education and clinical practice, empower veterinary professionals, and contribute to better animal healthcare.\n\nWe look forward to exploring a meaningful collaboration where shared goals create lasting impact. We'll be in touch soon!"
    },
    general: {
        title: 'Thank You for Contacting VetNova!',
        message: 'We have received your enquiry and our admissions team will get in touch with you shortly.'
    }
};
const createEnquiry = async (req, res) => {
    try {
        const { persona = 'general', name, firstName, lastName, audience, programName, designation, organization, phone, countryCode = '+91', email, profile, course, message, source = 'Counselling Form', sourcePage = '', formId = '', currentStage, areaOfInterest, skillToDevelop, yearsOfExperience, currentRole, areaToStrengthen, preferredTrainingLevel, background, lookingFor, skillsInterest, preferredLearningMode, explorationGoal, formData = {} } = req.body;
        // 1. Validate Persona
        const validPersonas = ['student', 'practitioner', 'nurse', 'partner', 'general'];
        const safePersona = validPersonas.includes(persona)
            ? persona
            : 'general';
        // 2. Validate Name & First/Last Names
        const safeFirstName = typeof firstName === 'string' ? firstName.trim().slice(0, 60) : '';
        const safeLastName = typeof lastName === 'string' ? lastName.trim().slice(0, 60) : '';
        let trimmedName = typeof name === 'string' ? name.trim() : '';
        if (!trimmedName && (safeFirstName || safeLastName)) {
            trimmedName = `${safeFirstName} ${safeLastName}`.trim();
        }
        if (!trimmedName || trimmedName.length < 2) {
            res.status(400).json({ success: false, message: 'Please enter a valid Full Name (minimum 2 characters)' });
            return;
        }
        // 3. Validate Phone Number (Preserve entered format, ensure valid phone / Indian mobile)
        const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';
        if (!trimmedPhone) {
            res.status(400).json({ success: false, message: 'Mobile Number / WhatsApp is required' });
            return;
        }
        const cleanDigits = trimmedPhone.replace(/[\s-]/g, '');
        const isIndian = INDIAN_MOBILE_REGEX.test(cleanDigits) || INDIAN_MOBILE_REGEX.test(trimmedPhone);
        const isValidGeneralPhone = PHONE_REGEX.test(trimmedPhone);
        if (!isIndian && !isValidGeneralPhone) {
            res.status(400).json({
                success: false,
                message: 'Please provide a valid 10-digit mobile number'
            });
            return;
        }
        // 4. Validate Email (Required for Sponsor/Partner and Counselling Form, optional for others but validated if provided)
        const trimmedEmail = typeof email === 'string' ? email.trim() : '';
        const isCounselling = source === 'Counselling Form' || (formData && (formData.role || formData.whoAreYou || formData.audience));
        if (safePersona === 'partner' || isCounselling) {
            if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
                res.status(400).json({ success: false, message: 'A valid Email address is required' });
                return;
            }
        }
        else if (trimmedEmail && !EMAIL_REGEX.test(trimmedEmail)) {
            res.status(400).json({ success: false, message: 'The email address provided is invalid' });
            return;
        }
        // 5. Build structured persona formData
        const aggregatedData = { ...formData };
        if (safePersona === 'student') {
            const stage = currentStage || formData.currentStage || profile || '';
            const interest = areaOfInterest || formData.areaOfInterest || course || '';
            const skill = skillToDevelop || formData.skillToDevelop || 'Surgery and clinical procedures';
            if (!stage) {
                res.status(400).json({ success: false, message: 'Please select your current stage (Veterinary student, Intern, or Fresh graduate)' });
                return;
            }
            if (!interest) {
                res.status(400).json({ success: false, message: 'Please select your area of interest' });
                return;
            }
            aggregatedData.currentStage = stage;
            aggregatedData.areaOfInterest = interest;
            aggregatedData.skillToDevelop = skill;
        }
        else if (safePersona === 'practitioner') {
            const exp = yearsOfExperience || formData.yearsOfExperience || '';
            const role = currentRole || formData.currentRole || '';
            const strengthen = areaToStrengthen || formData.areaToStrengthen || '';
            const level = preferredTrainingLevel || formData.preferredTrainingLevel || '';
            if (!exp) {
                res.status(400).json({ success: false, message: 'Please select your years of clinical experience' });
                return;
            }
            if (!role) {
                res.status(400).json({ success: false, message: 'Please select your current role' });
                return;
            }
            if (!strengthen) {
                res.status(400).json({ success: false, message: 'Please select the area you would like to strengthen' });
                return;
            }
            if (!level) {
                res.status(400).json({ success: false, message: 'Please select your preferred training level' });
                return;
            }
            aggregatedData.yearsOfExperience = exp;
            aggregatedData.currentRole = role;
            aggregatedData.areaToStrengthen = strengthen;
            aggregatedData.preferredTrainingLevel = level;
        }
        else if (safePersona === 'nurse') {
            const bg = background || formData.background || '';
            const looking = lookingFor || formData.lookingFor || '';
            const skills = skillsInterest || formData.skillsInterest || '';
            const mode = preferredLearningMode || formData.preferredLearningMode || '';
            if (!bg) {
                res.status(400).json({ success: false, message: 'Please select your background' });
                return;
            }
            if (!looking) {
                res.status(400).json({ success: false, message: 'Please select what you are looking for' });
                return;
            }
            if (!skills) {
                res.status(400).json({ success: false, message: 'Please select which skills interest you most' });
                return;
            }
            if (!mode) {
                res.status(400).json({ success: false, message: 'Please select your preferred learning mode' });
                return;
            }
            aggregatedData.background = bg;
            aggregatedData.lookingFor = looking;
            aggregatedData.skillsInterest = skills;
            aggregatedData.preferredLearningMode = mode;
        }
        else if (safePersona === 'partner') {
            const org = organization || formData.organization || '';
            const interest = areaOfInterest || formData.areaOfInterest || '';
            const explore = explorationGoal || message || formData.explorationGoal || '';
            if (!org) {
                res.status(400).json({ success: false, message: 'Organization / Company name is required' });
                return;
            }
            if (!interest) {
                res.status(400).json({ success: false, message: 'Please select an area of partnership interest' });
                return;
            }
            aggregatedData.organization = org;
            aggregatedData.areaOfInterest = interest;
            if (explore)
                aggregatedData.explorationGoal = String(explore).slice(0, 1000);
        }
        const leadId = generateLeadId();
        const safeCountryCode = typeof countryCode === 'string' ? countryCode.trim().slice(0, 10) : '+91';
        const safeMessage = typeof message === 'string' ? message.trim().slice(0, 2000) : '';
        const safeDesignation = typeof designation === 'string' ? designation.trim().slice(0, 150) : '';
        const safeOrganization = typeof organization === 'string'
            ? organization.trim().slice(0, 200)
            : (aggregatedData.organization ? String(aggregatedData.organization).slice(0, 200) : '');
        const safeAudience = typeof audience === 'string' && audience.trim()
            ? audience.trim().slice(0, 100)
            : (typeof profile === 'string' && profile.trim() ? profile.trim().slice(0, 100) : (aggregatedData.audience || aggregatedData.role || aggregatedData.whoAreYou || ''));
        const safeProgramName = typeof programName === 'string' && programName.trim()
            ? programName.trim().slice(0, 150)
            : (typeof course === 'string' && course.trim() ? course.trim().slice(0, 150) : (aggregatedData.programName || aggregatedData.interestedProgram || ''));
        const safeProfile = safeAudience || (typeof profile === 'string'
            ? profile.trim().slice(0, 100)
            : (aggregatedData.currentStage || aggregatedData.currentRole || aggregatedData.background || safePersona));
        const safeCourse = safeProgramName || (typeof course === 'string'
            ? course.trim().slice(0, 150)
            : (aggregatedData.areaOfInterest || aggregatedData.areaToStrengthen || aggregatedData.lookingFor || ''));
        const safeSource = typeof source === 'string' && source.trim() ? source.trim().slice(0, 100) : 'Counselling Form';
        aggregatedData.firstName = safeFirstName;
        aggregatedData.lastName = safeLastName;
        aggregatedData.audience = safeAudience;
        aggregatedData.programName = safeProgramName;
        if (safeAudience && !aggregatedData.role)
            aggregatedData.role = safeAudience;
        if (safeAudience && !aggregatedData.whoAreYou)
            aggregatedData.whoAreYou = safeAudience;
        if (safeProgramName && !aggregatedData.interestedProgram)
            aggregatedData.interestedProgram = safeProgramName;
        // 6. Create Lead in MongoDB
        const lead = await Enquiry_1.Enquiry.create({
            leadId,
            persona: safePersona,
            name: trimmedName.slice(0, 120),
            firstName: safeFirstName,
            lastName: safeLastName,
            audience: safeAudience,
            programName: safeProgramName,
            designation: safeDesignation,
            organization: safeOrganization,
            countryCode: safeCountryCode,
            phone: trimmedPhone,
            email: trimmedEmail.slice(0, 120).toLowerCase(),
            profile: safeProfile,
            course: safeCourse,
            message: safeMessage,
            formData: aggregatedData,
            source: safeSource,
            sourcePage: typeof sourcePage === 'string' ? sourcePage.slice(0, 300) : '',
            formId: typeof formId === 'string' ? formId.slice(0, 100) : '',
            status: 'New',
            notes: []
        });
        // 7. Dispatch asynchronous notification (does not block response)
        (0, emailService_1.sendLeadNotifications)(lead).catch((err) => {
            console.error('[Notification Dispatch Error]:', err);
        });
        const thankYou = THANK_YOU_MESSAGES[safePersona] || THANK_YOU_MESSAGES.general;
        res.status(201).json({
            success: true,
            message: 'Enquiry submitted successfully',
            data: {
                _id: lead._id,
                leadId: lead.leadId,
                persona: lead.persona,
                status: lead.status,
                thankYou
            }
        });
    }
    catch (error) {
        console.error('[createEnquiry Error]:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to submit your enquiry at this time. Please try again or reach out on WhatsApp.'
        });
    }
};
exports.createEnquiry = createEnquiry;
const getEnquiries = async (req, res) => {
    try {
        const { search, status, persona, audience, course, source, startDate, endDate, page = '1', limit = '20' } = req.query;
        const query = {};
        if (status && status !== 'all' && typeof status === 'string') {
            query.status = { $regex: new RegExp(`^${escapeRegex(status.trim())}$`, 'i') };
        }
        if (persona && persona !== 'all' && typeof persona === 'string') {
            if (persona.trim().toLowerCase() === 'counselling') {
                query.source = { $regex: /counselling/i };
            }
            else {
                query.persona = persona.trim().toLowerCase();
            }
        }
        if (audience && audience !== 'all' && typeof audience === 'string') {
            const audRegex = new RegExp(escapeRegex(audience.trim()), 'i');
            query.$or = [
                { audience: audRegex },
                { profile: audRegex },
                { 'formData.audience': audRegex },
                { 'formData.role': audRegex },
                { 'formData.whoAreYou': audRegex }
            ];
        }
        if (source && source !== 'all' && typeof source === 'string') {
            query.source = { $regex: new RegExp(escapeRegex(source.trim()), 'i') };
        }
        if (course && course !== 'all' && typeof course === 'string') {
            const courseRegex = new RegExp(escapeRegex(course.trim()), 'i');
            if (query.$or) {
                query.$and = [
                    { $or: query.$or },
                    { $or: [{ course: courseRegex }, { programName: courseRegex }] }
                ];
                delete query.$or;
            }
            else {
                query.$or = [{ course: courseRegex }, { programName: courseRegex }];
            }
        }
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate && typeof startDate === 'string') {
                const start = new Date(startDate);
                if (!isNaN(start.getTime())) {
                    query.createdAt.$gte = start;
                }
            }
            if (endDate && typeof endDate === 'string') {
                const end = new Date(endDate);
                if (!isNaN(end.getTime())) {
                    end.setHours(23, 59, 59, 999);
                    query.createdAt.$lte = end;
                }
            }
            if (Object.keys(query.createdAt).length === 0) {
                delete query.createdAt;
            }
        }
        if (search && typeof search === 'string') {
            const safeSearch = escapeRegex(search.trim());
            const searchRegex = new RegExp(safeSearch, 'i');
            const searchConditions = [
                { leadId: searchRegex },
                { name: searchRegex },
                { firstName: searchRegex },
                { lastName: searchRegex },
                { email: searchRegex },
                { phone: searchRegex },
                { audience: searchRegex },
                { programName: searchRegex },
                { organization: searchRegex },
                { designation: searchRegex },
                { profile: searchRegex },
                { course: searchRegex },
                { message: searchRegex },
                { source: searchRegex },
                { sourcePage: searchRegex }
            ];
            if (query.$or) {
                query.$and = (query.$and || []).concat([
                    { $or: query.$or },
                    { $or: searchConditions }
                ]);
                delete query.$or;
            }
            else if (query.$and) {
                query.$and.push({ $or: searchConditions });
            }
            else {
                query.$or = searchConditions;
            }
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
        console.error('[getEnquiries Error]:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching enquiries' });
    }
};
exports.getEnquiries = getEnquiries;
const getEnquiryById = async (req, res) => {
    try {
        const id = getParamId(req);
        let enquiry = null;
        if (mongoose_1.default.Types.ObjectId.isValid(id)) {
            enquiry = await Enquiry_1.Enquiry.findById(id);
        }
        else {
            enquiry = await Enquiry_1.Enquiry.findOne({ leadId: id });
        }
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
const updateEnquiry = async (req, res) => {
    try {
        const id = getParamId(req);
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: 'Invalid enquiry ID' });
            return;
        }
        const { status, name, firstName, lastName, audience, programName, source, phone, email, profile, course, message, organization, designation, notes } = req.body;
        const enquiry = await Enquiry_1.Enquiry.findById(id);
        if (!enquiry) {
            res.status(404).json({ success: false, message: 'Enquiry not found' });
            return;
        }
        if (status) {
            const validStatuses = ['New', 'Contacted', 'Follow-up Required', 'Qualified', 'Closed', 'Converted'];
            if (!validStatuses.includes(status)) {
                res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
                return;
            }
            enquiry.status = status;
        }
        if (name !== undefined)
            enquiry.name = String(name).trim().slice(0, 120);
        if (firstName !== undefined)
            enquiry.firstName = String(firstName).trim().slice(0, 60);
        if (lastName !== undefined)
            enquiry.lastName = String(lastName).trim().slice(0, 60);
        if (audience !== undefined)
            enquiry.audience = String(audience).trim().slice(0, 100);
        if (programName !== undefined)
            enquiry.programName = String(programName).trim().slice(0, 150);
        if (source !== undefined)
            enquiry.source = String(source).trim().slice(0, 100);
        if (phone !== undefined)
            enquiry.phone = String(phone).trim();
        if (email !== undefined)
            enquiry.email = String(email).trim().toLowerCase().slice(0, 120);
        if (organization !== undefined)
            enquiry.organization = String(organization).trim().slice(0, 200);
        if (designation !== undefined)
            enquiry.designation = String(designation).trim().slice(0, 150);
        if (profile !== undefined)
            enquiry.profile = String(profile).trim().slice(0, 100);
        if (course !== undefined)
            enquiry.course = String(course).trim().slice(0, 150);
        if (message !== undefined)
            enquiry.message = String(message).trim().slice(0, 2000);
        if (Array.isArray(notes)) {
            enquiry.notes = notes;
        }
        const updatedEnquiry = await enquiry.save();
        res.json({
            success: true,
            message: 'Enquiry updated successfully',
            data: updatedEnquiry
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: 'Error updating enquiry' });
    }
};
exports.updateEnquiry = updateEnquiry;
const addEnquiryNote = async (req, res) => {
    try {
        const id = getParamId(req);
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: 'Invalid enquiry ID' });
            return;
        }
        const { text, author } = req.body;
        if (!text || typeof text !== 'string' || !text.trim()) {
            res.status(400).json({ success: false, message: 'Note text cannot be empty' });
            return;
        }
        const enquiry = await Enquiry_1.Enquiry.findById(id);
        if (!enquiry) {
            res.status(404).json({ success: false, message: 'Enquiry not found' });
            return;
        }
        const userObj = req.user;
        const authorName = author || userObj?.name || 'Admin';
        enquiry.notes.push({
            text: text.trim().slice(0, 1000),
            author: authorName,
            createdAt: new Date()
        });
        await enquiry.save();
        res.status(201).json({
            success: true,
            message: 'Note added successfully',
            data: enquiry.notes
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error adding internal note' });
    }
};
exports.addEnquiryNote = addEnquiryNote;
const deleteEnquiry = async (req, res) => {
    try {
        const id = getParamId(req);
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: 'Invalid enquiry ID' });
            return;
        }
        const enquiry = await Enquiry_1.Enquiry.findByIdAndDelete(id);
        if (!enquiry) {
            res.status(404).json({ success: false, message: 'Enquiry not found' });
            return;
        }
        res.json({ success: true, message: 'Enquiry removed successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting enquiry' });
    }
};
exports.deleteEnquiry = deleteEnquiry;
const exportEnquiriesCSV = async (req, res) => {
    try {
        const { persona, status, startDate, endDate } = req.query;
        const query = {};
        if (status && status !== 'all' && typeof status === 'string') {
            query.status = status.trim();
        }
        if (persona && persona !== 'all' && typeof persona === 'string') {
            query.persona = persona.trim().toLowerCase();
        }
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate && typeof startDate === 'string')
                query.createdAt.$gte = new Date(startDate);
            if (endDate && typeof endDate === 'string') {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }
        const leads = await Enquiry_1.Enquiry.find(query).sort({ createdAt: -1 });
        const headers = [
            'Lead ID',
            'Source',
            'Persona',
            'Audience / Role',
            'Full Name',
            'First Name',
            'Last Name',
            'Phone Number',
            'Email Address',
            'Interested Program',
            'Organization',
            'Designation',
            'Status',
            'Submitted Date',
            'Form Responses',
            'Notes Count',
            'Latest Note'
        ];
        const escapeCsv = (val) => {
            if (val === null || val === undefined)
                return '""';
            const str = String(val).replace(/"/g, '""');
            return `"${str}"`;
        };
        const rows = leads.map((l) => {
            const formattedResponses = l.formData
                ? Object.entries(l.formData).map(([k, v]) => `${k}: ${v}`).join('; ')
                : (l.programName || l.course || l.audience || l.profile || '');
            const latestNote = l.notes && l.notes.length > 0
                ? l.notes[l.notes.length - 1].text
                : '';
            return [
                escapeCsv(l.leadId || l._id),
                escapeCsv(l.source || 'Counselling Form'),
                escapeCsv(l.persona || 'general'),
                escapeCsv(l.audience || l.profile || (l.formData ? (l.formData.role || l.formData.whoAreYou) : '') || ''),
                escapeCsv(l.name),
                escapeCsv(l.firstName || ''),
                escapeCsv(l.lastName || ''),
                escapeCsv((l.countryCode ? l.countryCode + ' ' : '') + l.phone),
                escapeCsv(l.email || ''),
                escapeCsv(l.programName || l.course || ''),
                escapeCsv(l.organization || ''),
                escapeCsv(l.designation || ''),
                escapeCsv(l.status),
                escapeCsv(new Date(l.createdAt).toISOString()),
                escapeCsv(formattedResponses),
                escapeCsv(l.notes ? l.notes.length : 0),
                escapeCsv(latestNote)
            ].join(',');
        });
        const csvContent = [headers.join(','), ...rows].join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="vetnova-leads-${Date.now()}.csv"`);
        res.status(200).send(csvContent);
    }
    catch (error) {
        console.error('[exportEnquiriesCSV Error]:', error);
        res.status(500).json({ success: false, message: 'Failed to generate CSV export' });
    }
};
exports.exportEnquiriesCSV = exportEnquiriesCSV;
//# sourceMappingURL=enquiryController.js.map