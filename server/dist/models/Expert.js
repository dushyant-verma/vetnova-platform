"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expert = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const expertSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    designation: { type: String },
    qualification: { type: String },
    department: { type: String },
    specialization: { type: String },
    experience: { type: String },
    education: { type: String },
    bio: { type: String },
    image: { type: String },
    email: { type: String },
    linkedin: { type: String },
    socialLinks: {
        linkedin: String,
        twitter: String
    },
    programs: [{ type: String }],
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['Published', 'Draft'], default: 'Published' }
}, { timestamps: true });
exports.Expert = mongoose_1.default.model('Expert', expertSchema);
//# sourceMappingURL=Expert.js.map