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
  status: { type: String, enum: ['Published', 'Draft'], default: 'Published' },
  // Extended fields for rich inline profile
  fullBio: { type: mongoose.Schema.Types.Mixed },
  qualifications: [{
    degree: { type: String },
    field: { type: String },
    institution: { type: String },
    year: { type: String }
  }],
  achievements: [{ type: String }],
  researchInterests: [{ type: String }]
}, { timestamps: true });

export const AdvisoryBoard = mongoose.model('AdvisoryBoard', advisoryBoardSchema);
