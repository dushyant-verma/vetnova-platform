"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const programSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    order: { type: Number, default: 99 },
    description: { type: String, required: true },
    shortDescription: { type: String, trim: true },
    fullDescription: { type: String, trim: true },
    duration: { type: String, default: "3 Days" },
    dailyDuration: { type: String, default: "8 Hours / Day" },
    courseLength: { type: String, default: "8 Hours / Day" },
    trainingSchedule: { type: String, default: "8 Hours Per Day" },
    availability: { type: String, default: "8 Hours / Day" },
    learningLevel: { type: String, default: "All Levels" },
    level: { type: String, default: "All Levels" },
    levels: { type: [String], default: ["Foundation", "Intermediate", "Advanced"] },
    learningOutcomes: [{ type: String }],
    curriculum: [{ title: String, content: String }],
    faculty: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Expert" }],
    category: { type: String, default: "Clinical Training" },
    image: { type: String },
    status: { type: String, enum: ["Draft", "Published"], default: "Published" },
    syllabusStatus: { type: String, enum: ["Available", "Pending"], default: "Pending" },
    syllabusStatusByLevel: {
        foundation: { type: String, enum: ["Available", "Pending"], default: "Available" },
        intermediate: { type: String, enum: ["Available", "Pending"], default: "Available" },
        advanced: { type: String, enum: ["Available", "Pending"], default: "Available" }
    },
    stageTitles: {
        foundation: { type: String },
        intermediate: { type: String },
        advanced: { type: String }
    },
    stageDescriptions: {
        foundation: { type: String },
        intermediate: { type: String },
        advanced: { type: String }
    },
    syllabus: {
        foundation: [{ type: String }],
        intermediate: [{ type: String }],
        advanced: [{ type: String }]
    },
    isActive: { type: Boolean, default: true },
}, { timestamps: true, strict: false });
// Sync isActive with status
programSchema.pre("save", function () {
    if (this.status === "Draft") {
        this.isActive = false;
    }
    else if (this.status === "Published") {
        this.isActive = true;
    }
});
exports.Program = mongoose_1.default.model("Program", programSchema);
//# sourceMappingURL=Program.js.map