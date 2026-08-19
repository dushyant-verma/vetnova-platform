"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogCategory = void 0;
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
const blogCategorySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    status: { type: String, enum: ['Published', 'Draft'], default: 'Published' }
}, { timestamps: true });
blogCategorySchema.pre('validate', function (next) {
    if (this.name && !this.slug) {
        this.slug = generateSlug(this.name);
    }
    else if (this.slug) {
        this.slug = generateSlug(this.slug);
    }
    if (typeof next === 'function') {
        next();
    }
});
exports.BlogCategory = mongoose_1.default.model('BlogCategory', blogCategorySchema);
//# sourceMappingURL=BlogCategory.js.map