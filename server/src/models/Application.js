"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const applicationSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    qualification: { type: String, required: true },
    program: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Program', required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
}, { timestamps: true });
exports.Application = mongoose_1.default.model('Application', applicationSchema);
//# sourceMappingURL=Application.js.map