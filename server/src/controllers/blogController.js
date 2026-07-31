"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogById = exports.getBlogs = void 0;
const Blog_1 = __importDefault(require("../models/Blog"));
const getBlogs = async (req, res) => {
    try {
        const filters = req.query || {};
        const items = await Blog_1.default.find(filters).sort({ createdAt: -1 });
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getBlogs = getBlogs;
const getBlogById = async (req, res) => {
    try {
        const item = await Blog_1.default.findById(req.params.id);
        if (!item)
            return res.status(404).json({ message: 'Not found' });
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getBlogById = getBlogById;
const createBlog = async (req, res) => {
    try {
        const newItem = new Blog_1.default(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createBlog = createBlog;
const updateBlog = async (req, res) => {
    try {
        const updatedItem = await Blog_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedItem)
            return res.status(404).json({ message: 'Not found' });
        res.json(updatedItem);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateBlog = updateBlog;
const deleteBlog = async (req, res) => {
    try {
        const deletedItem = await Blog_1.default.findByIdAndDelete(req.params.id);
        if (!deletedItem)
            return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.deleteBlog = deleteBlog;
//# sourceMappingURL=blogController.js.map