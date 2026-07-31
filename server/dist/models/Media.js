"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Media = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MediaSchema = new mongoose_1.default.Schema({
    filename: { type: String, required: true },
    url: { type: String, required: true },
    public_id: { type: String }, // Cloudinary ID
    format: String,
    size: Number,
    folder: { type: String, default: 'general' },
    altText: String
}, { timestamps: true });
exports.Media = mongoose_1.default.model('Media', MediaSchema);
//# sourceMappingURL=Media.js.map