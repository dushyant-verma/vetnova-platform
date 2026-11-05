"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Batch = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const batchSchema = new mongoose_1.default.Schema({
    batchTitle: { type: String, trim: true },
    programName: { type: String, required: true, trim: true },
    programSlug: { type: String, trim: true },
    programId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Program',
        set: (v) => (v === '' || !v ? undefined : v)
    },
    facultyName: { type: String, required: true, trim: true },
    facultyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Expert',
        set: (v) => (v === '' || !v ? undefined : v)
    },
    startDate: { type: Date, required: true },
    endDate: {
        type: Date,
        set: (v) => (v === '' || !v ? undefined : v)
    },
    duration: { type: String, default: '3 Days', trim: true },
    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Completed'],
        default: 'Upcoming',
        index: true
    },
    seatStatus: { type: String, default: 'Admissions Open', trim: true },
    location: { type: String, default: 'Pune Campus', trim: true },
    maxSeats: { type: Number, default: 12 },
    notes: { type: String, trim: true },
    displayOrder: { type: Number, default: 0 }
}, { timestamps: true });
exports.Batch = mongoose_1.default.model('Batch', batchSchema);
//# sourceMappingURL=Batch.js.map