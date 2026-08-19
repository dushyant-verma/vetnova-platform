"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvisoryBoard = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const advisoryBoardSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    designation: { type: String },
    organization: { type: String },
    qualification: { type: String },
    bio: { type: String },
    image: { type: String },
    linkedin: { type: String },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['Published', 'Draft'], default: 'Published' }
}, { timestamps: true });
exports.AdvisoryBoard = mongoose_1.default.model('AdvisoryBoard', advisoryBoardSchema);
//# sourceMappingURL=AdvisoryBoard.js.map