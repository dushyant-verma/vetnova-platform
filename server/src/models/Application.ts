import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  qualification: { type: String, required: true },
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
}, { timestamps: true });

export const Application = mongoose.model('Application', applicationSchema);
