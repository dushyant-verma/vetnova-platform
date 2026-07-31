import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, default: 'Workshop' },
}, { timestamps: true });

export const Gallery = mongoose.model('Gallery', gallerySchema);
