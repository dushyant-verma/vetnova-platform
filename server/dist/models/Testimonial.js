"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Testimonial = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const testimonialSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, default: 5 },
    image: { type: String },
}, { timestamps: true });
exports.Testimonial = mongoose_1.default.model('Testimonial', testimonialSchema);
//# sourceMappingURL=Testimonial.js.map