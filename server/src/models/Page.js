"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const SectionSchema = new mongoose_1.default.Schema({
    title: String,
    subtitle: String,
    description: String,
    richText: String,
    image: String,
    gallery: [String],
    background: String,
    ctaText: String,
    ctaLink: String,
    icon: String,
    order: { type: Number, default: 0 },
    visibility: { type: Boolean, default: true },
    theme: String,
    animation: String,
    type: { type: String, required: true }, // e.g., 'Hero', 'Features', 'Stats', 'FAQ'
    metadata: mongoose_1.default.Schema.Types.Mixed // JSON field for custom stats, cards, faqs
});
const PageSchema = new mongoose_1.default.Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    sections: [SectionSchema],
    seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: String,
        openGraph: String,
        twitterCard: String,
        canonical: String,
        jsonLd: String,
    },
    published: { type: Boolean, default: true }
}, { timestamps: true });
exports.Page = mongoose_1.default.model('Page', PageSchema);
//# sourceMappingURL=Page.js.map