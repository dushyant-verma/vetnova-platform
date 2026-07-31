import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  public_id: { type: String }, // Cloudinary ID
  format: String,
  size: Number,
  folder: { type: String, default: 'general' },
  altText: String
}, { timestamps: true });

export const Media = mongoose.model('Media', MediaSchema);
