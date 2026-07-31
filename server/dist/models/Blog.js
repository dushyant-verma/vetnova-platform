"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const blogSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String },
    image: { type: String },
    status: { type: String, enum: ['Published', 'Draft'], default: 'Draft' },
}, { timestamps: true });
exports.Blog = mongoose_1.default.model('Blog', blogSchema);
//# sourceMappingURL=Blog.js.map