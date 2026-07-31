import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String },
  image: { type: String },
  status: { type: String, enum: ['Published', 'Draft'], default: 'Draft' },
}, { timestamps: true });

export const Blog = mongoose.model('Blog', blogSchema);
