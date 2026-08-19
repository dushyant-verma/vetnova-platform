import mongoose from 'mongoose';

const expertSchema = new mongoose.Schema({
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

export const Expert = mongoose.model('Expert', expertSchema);
