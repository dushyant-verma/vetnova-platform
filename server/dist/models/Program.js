"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const programSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    learningOutcomes: [{ type: String }],
    curriculum: [{ title: String, content: String }],
    faculty: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Expert' }],
    category: { type: String, required: true },
    image: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.Program = mongoose_1.default.model('Program', programSchema);
//# sourceMappingURL=Program.js.map