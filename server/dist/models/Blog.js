"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
function generateSlug(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}
const blogSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    author: { type: String, required: true },
    authorRole: { type: String, default: 'Veterinary Specialist' },
    authorImage: { type: String },
    category: { type: String, default: 'General' },
    categories: [{ type: String }],
    tags: [{ type: String }],
    image: { type: String },
    status: { type: String, enum: ['Published', 'Draft'], default: 'Published' },
    isFeatured: { type: Boolean, default: false },
    readTime: { type: String, default: '5 Min Read' },
    seoTitle: { type: String },
    seoDescription: { type: String },
    ogImage: { type: String },
}, { timestamps: true });
blogSchema.pre('validate', function (next) {
    if (this.slug) {
        this.slug = generateSlug(this.slug);
    }
    else if (this.title) {
        this.slug = generateSlug(this.title);
    }
    // Ensure categories array and legacy category field remain synced
    if (Array.isArray(this.categories) && this.categories.length > 0) {
        this.category = this.categories[0];
    }
    else if (this.category) {
        this.categories = [this.category];
    }
    if (typeof next === 'function') {
        next();
    }
});
exports.Blog = mongoose_1.default.model('Blog', blogSchema);
//# sourceMappingURL=Blog.js.map