import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  learningOutcomes: [{ type: String }],
  curriculum: [{ title: String, content: String }],
  faculty: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expert' }],
  category: { type: String, required: true },
  image: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Program = mongoose.model('Program', programSchema);
