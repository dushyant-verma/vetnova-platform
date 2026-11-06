import mongoose from "mongoose";

export interface ISyllabus {
  foundation: string[];
  intermediate: string[];
  advanced: string[];
}

export interface IProgram extends mongoose.Document {
  title: string;
  slug: string;
  order?: number;
  description: string;
  shortDescription?: string;
  fullDescription?: string;
  duration?: string;
  availability?: string;
  learningLevel?: "Beginner" | "Intermediate" | "Advanced";
  level?: "Beginner" | "Intermediate" | "Advanced";
  learningOutcomes?: string[];
  curriculum?: { title: string; content: string }[];
  faculty?: mongoose.Types.ObjectId[];
  category: string;
  image?: string;
  status: "Draft" | "Published";
  syllabusStatus: "Available" | "Pending";
  syllabus: ISyllabus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const programSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  order: { type: Number, default: 99 },
  description: { type: String, required: true },
  shortDescription: { type: String, trim: true },
  fullDescription: { type: String, trim: true },
  duration: { type: String, default: "3 Days" },
  availability: { type: String, default: "24 Hours" },
  learningLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
  level: { type: String, default: "Beginner" },
  learningOutcomes: [{ type: String }],
  curriculum: [{ title: String, content: String }],
  faculty: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expert" }],
  category: { type: String, default: "Clinical Training" },
  image: { type: String },
  status: { type: String, enum: ["Draft", "Published"], default: "Published" },
  syllabusStatus: { type: String, enum: ["Available", "Pending"], default: "Pending" },
  syllabus: {
    foundation: [{ type: String }],
    intermediate: [{ type: String }],
    advanced: [{ type: String }]
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Sync isActive with status
programSchema.pre("save", function () {
  if (this.status === "Draft") {
    this.isActive = false;
  } else if (this.status === "Published") {
    this.isActive = true;
  }
});

export const Program = mongoose.model<IProgram>("Program", programSchema);
