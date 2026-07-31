"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gallery = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const gallerySchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, default: 'Workshop' },
}, { timestamps: true });
exports.Gallery = mongoose_1.default.model('Gallery', gallerySchema);
//# sourceMappingURL=Gallery.js.map