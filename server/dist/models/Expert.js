"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expert = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const expertSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: String },
    education: { type: String },
    bio: { type: String },
    image: { type: String },
    socialLinks: {
        linkedin: String,
        twitter: String
    }
}, { timestamps: true });
exports.Expert = mongoose_1.default.model('Expert', expertSchema);
//# sourceMappingURL=Expert.js.map