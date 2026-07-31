import mongoose from 'mongoose';

const expertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: String },
  education: { type: String },
  bio: { type: String },
  image: { type: String },
  socialLinks: {
    linkedin: String,
    twitter: String
  }
}, { timestamps: true });

export const Expert = mongoose.model('Expert', expertSchema);
