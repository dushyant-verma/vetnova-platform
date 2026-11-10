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
        set: (v) => (v === '' || !v ? undefined : v),
        validate: {
            validator: function (val) {
                if (!val)
                    return true;
                let start = this?.startDate;
                if (!start && typeof this?.getUpdate === 'function') {
                    const update = this.getUpdate();
                    start = update?.startDate || update?.$set?.startDate;
                }
                if (start) {
                    const s = new Date(start).getTime();
                    const e = new Date(val).getTime();
                    if (!isNaN(s) && !isNaN(e) && s > e) {
                        return false;
                    }
                }
                return true;
            },
            message: 'Batch end date cannot be earlier than start date'
        }
    },
    duration: { type: String, default: '3 Days', trim: true },
    dailyDuration: { type: String, default: '8 Hours / Day', trim: true },
    trainingSchedule: { type: String, default: '8 Hours Per Day', trim: true },
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
}, { timestamps: true, strict: false });
batchSchema.pre('validate', function () {
    if (this.startDate && this.endDate) {
        const start = new Date(this.startDate).getTime();
        const end = new Date(this.endDate).getTime();
        if (!isNaN(start) && !isNaN(end) && start > end) {
            this.invalidate('endDate', 'Batch end date cannot be earlier than start date');
        }
    }
});
exports.Batch = mongoose_1.default.model('Batch', batchSchema);
//# sourceMappingURL=Batch.js.map