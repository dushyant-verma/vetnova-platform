import mongoose from 'mongoose';

const advisoryBoardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String },
  organization: { type: String },
  qualification: { type: String },
  bio: { type: String },
  image: { type: String },
  linkedin: { type: String },
  displayOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['Published', 'Draft'], default: 'Published' }
}, { timestamps: true });

export const AdvisoryBoard = mongoose.model('AdvisoryBoard', advisoryBoardSchema);
