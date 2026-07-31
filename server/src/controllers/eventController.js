"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEventById = exports.getEvents = void 0;
const Event_1 = __importDefault(require("../models/Event"));
const getEvents = async (req, res) => {
    try {
        const filters = req.query || {};
        const items = await Event_1.default.find(filters).sort({ createdAt: -1 });
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getEvents = getEvents;
const getEventById = async (req, res) => {
    try {
        const item = await Event_1.default.findById(req.params.id);
        if (!item)
            return res.status(404).json({ message: 'Not found' });
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getEventById = getEventById;
const createEvent = async (req, res) => {
    try {
        const newItem = new Event_1.default(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createEvent = createEvent;
const updateEvent = async (req, res) => {
    try {
        const updatedItem = await Event_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedItem)
            return res.status(404).json({ message: 'Not found' });
        res.json(updatedItem);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    try {
        const deletedItem = await Event_1.default.findByIdAndDelete(req.params.id);
        if (!deletedItem)
            return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.deleteEvent = deleteEvent;
//# sourceMappingURL=eventController.js.map