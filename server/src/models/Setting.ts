import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g., 'global_settings', 'theme', 'contact_info'
  value: { type: mongoose.Schema.Types.Mixed, required: true }, // JSON value
}, { timestamps: true });

export const Setting = mongoose.model('Setting', SettingSchema);
