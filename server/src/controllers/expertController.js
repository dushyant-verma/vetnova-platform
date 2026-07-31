"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpert = exports.updateExpert = exports.createExpert = exports.getExpertById = exports.getExperts = void 0;
const Expert_1 = __importDefault(require("../models/Expert"));
const getExperts = async (req, res) => {
    try {
        const filters = req.query || {};
        const items = await Expert_1.default.find(filters).sort({ createdAt: -1 });
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getExperts = getExperts;
const getExpertById = async (req, res) => {
    try {
        const item = await Expert_1.default.findById(req.params.id);
        if (!item)
            return res.status(404).json({ message: 'Not found' });
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getExpertById = getExpertById;
const createExpert = async (req, res) => {
    try {
        const newItem = new Expert_1.default(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createExpert = createExpert;
const updateExpert = async (req, res) => {
    try {
        const updatedItem = await Expert_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedItem)
            return res.status(404).json({ message: 'Not found' });
        res.json(updatedItem);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateExpert = updateExpert;
const deleteExpert = async (req, res) => {
    try {
        const deletedItem = await Expert_1.default.findByIdAndDelete(req.params.id);
        if (!deletedItem)
            return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.deleteExpert = deleteExpert;
//# sourceMappingURL=expertController.js.map