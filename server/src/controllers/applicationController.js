"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.updateApplication = exports.createApplication = exports.getApplicationById = exports.getApplications = void 0;
const Application_1 = __importDefault(require("../models/Application"));
const getApplications = async (req, res) => {
    try {
        const filters = req.query || {};
        const items = await Application_1.default.find(filters).sort({ createdAt: -1 });
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getApplications = getApplications;
const getApplicationById = async (req, res) => {
    try {
        const item = await Application_1.default.findById(req.params.id);
        if (!item)
            return res.status(404).json({ message: 'Not found' });
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getApplicationById = getApplicationById;
const createApplication = async (req, res) => {
    try {
        const newItem = new Application_1.default(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createApplication = createApplication;
const updateApplication = async (req, res) => {
    try {
        const updatedItem = await Application_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedItem)
            return res.status(404).json({ message: 'Not found' });
        res.json(updatedItem);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateApplication = updateApplication;
const deleteApplication = async (req, res) => {
    try {
        const deletedItem = await Application_1.default.findByIdAndDelete(req.params.id);
        if (!deletedItem)
            return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.deleteApplication = deleteApplication;
//# sourceMappingURL=applicationController.js.map