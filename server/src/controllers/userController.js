"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const getUsers = async (req, res) => {
    try {
        const filters = req.query || {};
        const items = await User_1.default.find(filters).sort({ createdAt: -1 });
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const item = await User_1.default.findById(req.params.id);
        if (!item)
            return res.status(404).json({ message: 'Not found' });
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    try {
        const newItem = new User_1.default(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const updatedItem = await User_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedItem)
            return res.status(404).json({ message: 'Not found' });
        res.json(updatedItem);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const deletedItem = await User_1.default.findByIdAndDelete(req.params.id);
        if (!deletedItem)
            return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map