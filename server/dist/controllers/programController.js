"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProgram = exports.updateProgram = exports.createProgram = exports.getProgramById = exports.getPrograms = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Program_1 = require("../models/Program");
const Batch_1 = require("../models/Batch");
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
const getPrograms = async (req, res) => {
    try {
        const { search, category, status, syllabusStatus, all, level, learningLevel } = req.query;
        const filter = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }
        if (category && category !== "all") {
            filter.category = category;
        }
        const lvl = (learningLevel || level);
        if (lvl && lvl !== "all") {
            filter.$or = [
                { learningLevel: { $regex: new RegExp(`^${lvl}$`, "i") } },
                { level: { $regex: new RegExp(`^${lvl}$`, "i") } }
            ];
        }
        if (syllabusStatus && syllabusStatus !== "all") {
            filter.syllabusStatus = syllabusStatus;
        }
        // If "all" is requested (e.g. from admin), allow drafts; otherwise default to Published
        if (status) {
            if (status !== "all")
                filter.status = status;
        }
        else if (all !== "true" && !req.user) {
            filter.status = "Published";
        }
        const programs = await Program_1.Program.find(filter)
            .sort({ order: 1, title: 1 })
            .populate("faculty", "name specialization department image experience status programs");
        // Clean legacy/broken image paths and self-heal in MongoDB
        Program_1.Program.updateMany({ slug: 'orthopaedics', image: { $regex: 'facility-diagnostics-room' } }, { $set: { image: 'assets/images/programs/program-orthopaedics.webp' } }).exec().catch(() => { });
        Program_1.Program.updateMany({ slug: 'veterinary-dentistry', image: { $regex: 'facility-diagnostics-room' } }, { $set: { image: 'assets/images/programs/program-dentistry.webp' } }).exec().catch(() => { });
        Program_1.Program.updateMany({ slug: 'nephrology-and-urology', image: { $regex: 'facility-diagnostics-room' } }, { $set: { image: 'assets/images/programs/program-nephrology.webp' } }).exec().catch(() => { });
        // Self-heal and standardize all program durations to 3 Days in MongoDB
        Program_1.Program.updateMany({ duration: { $nin: ['3 Days', '2 Days'] } }, { $set: { duration: '3 Days' } }).exec().catch(() => { });
        const cleaned = programs.map((p) => {
            const obj = p.toObject ? p.toObject() : { ...p };
            obj.duration = (obj.duration && obj.duration.toLowerCase().includes('day')) ? obj.duration : '3 Days';
            if (obj.slug === 'orthopaedics' && (!obj.image || obj.image.includes('facility-diagnostics-room'))) {
                obj.image = 'assets/images/programs/program-orthopaedics.webp';
            }
            else if (obj.slug === 'veterinary-dentistry' && (!obj.image || obj.image.includes('facility-diagnostics-room'))) {
                obj.image = 'assets/images/programs/program-dentistry.webp';
            }
            else if (obj.slug === 'nephrology-and-urology' && (!obj.image || obj.image.includes('facility-diagnostics-room'))) {
                obj.image = 'assets/images/programs/program-nephrology.webp';
            }
            return obj;
        });
        res.json(cleaned);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getPrograms = getPrograms;
const getProgramById = async (req, res) => {
    try {
        const param = req.params.id;
        let query;
        if (mongoose_1.default.isValidObjectId(String(param))) {
            query = { $or: [{ _id: param }, { slug: param }] };
        }
        else {
            query = { slug: String(param).toLowerCase() };
        }
        const program = await Program_1.Program.findOne(query).populate("faculty");
        if (program) {
            const obj = program.toObject ? program.toObject() : { ...program };
            obj.duration = (obj.duration && obj.duration.toLowerCase().includes('day')) ? obj.duration : '3 Days';
            res.json(obj);
        }
        else {
            res.status(404).json({ message: "Program not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProgramById = getProgramById;
const createProgram = async (req, res) => {
    try {
        const data = { ...req.body };
        delete data._id;
        delete data.__v;
        delete data.createdAt;
        delete data.updatedAt;
        if (!data.title || !String(data.title).trim()) {
            return res.status(400).json({ message: "Program title is required" });
        }
        if (!data.slug || !String(data.slug).trim()) {
            data.slug = slugify(data.title);
        }
        else {
            data.slug = slugify(data.slug);
        }
        // Check for duplicate slug
        const existingSlug = await Program_1.Program.findOne({ slug: data.slug });
        if (existingSlug) {
            data.slug = `${data.slug}-${Date.now().toString().slice(-4)}`;
        }
        if (!data.description && data.shortDescription) {
            data.description = data.shortDescription;
        }
        if (!data.shortDescription && data.description) {
            data.shortDescription = data.description;
        }
        if (!data.description) {
            data.description = data.title;
            data.shortDescription = data.title;
        }
        if (!data.duration) {
            data.duration = "3 Days";
        }
        if (!data.availability) {
            data.availability = "24 Hours";
        }
        if (data.status === "Draft") {
            data.isActive = false;
        }
        else {
            data.isActive = true;
        }
        if (data.learningLevel || data.level) {
            const lvl = data.learningLevel || data.level;
            data.learningLevel = lvl;
            data.level = lvl;
        }
        if (Array.isArray(data.faculty)) {
            data.faculty = data.faculty.filter((f) => f && mongoose_1.default.isValidObjectId(String(f)));
        }
        const program = new Program_1.Program(data);
        const createdProgram = await program.save();
        res.status(201).json(createdProgram);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createProgram = createProgram;
const updateProgram = async (req, res) => {
    try {
        const param = req.params.id;
        const data = { ...req.body };
        delete data._id;
        delete data.__v;
        delete data.createdAt;
        delete data.updatedAt;
        if (data.slug) {
            data.slug = slugify(data.slug);
            const queryParam = mongoose_1.default.isValidObjectId(param) ? { _id: { $ne: param } } : { slug: { $ne: String(param) } };
            const conflict = await Program_1.Program.findOne({ slug: data.slug, ...queryParam });
            if (conflict) {
                return res.status(400).json({ message: `A program with the slug "${data.slug}" already exists` });
            }
        }
        if (!data.description && data.shortDescription) {
            data.description = data.shortDescription;
        }
        if (!data.shortDescription && data.description) {
            data.shortDescription = data.description;
        }
        if (data.status === "Draft") {
            data.isActive = false;
        }
        else if (data.status === "Published") {
            data.isActive = true;
        }
        if (data.learningLevel || data.level) {
            const lvl = data.learningLevel || data.level;
            data.learningLevel = lvl;
            data.level = lvl;
        }
        if (Array.isArray(data.faculty)) {
            data.faculty = data.faculty.filter((f) => f && mongoose_1.default.isValidObjectId(String(f)));
        }
        let program;
        if (mongoose_1.default.isValidObjectId(param)) {
            program = await Program_1.Program.findByIdAndUpdate(param, data, { new: true, runValidators: true });
        }
        else {
            program = await Program_1.Program.findOneAndUpdate({ slug: String(param) }, data, { new: true, runValidators: true });
        }
        if (!program) {
            return res.status(404).json({ message: "Program not found" });
        }
        res.json(program);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateProgram = updateProgram;
const deleteProgram = async (req, res) => {
    try {
        const param = req.params.id;
        let deleted;
        if (mongoose_1.default.isValidObjectId(param)) {
            deleted = await Program_1.Program.findByIdAndDelete(param);
            if (deleted) {
                await Batch_1.Batch.updateMany({ programId: param }, { $unset: { programId: 1 } });
            }
        }
        else {
            deleted = await Program_1.Program.findOneAndDelete({ slug: String(param) });
            if (deleted) {
                await Batch_1.Batch.updateMany({ programId: deleted._id }, { $unset: { programId: 1 } });
            }
        }
        if (!deleted) {
            return res.status(404).json({ message: "Program not found" });
        }
        res.json({ message: "Program removed successfully" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deleteProgram = deleteProgram;
//# sourceMappingURL=programController.js.map