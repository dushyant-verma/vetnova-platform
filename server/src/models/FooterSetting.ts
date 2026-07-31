import mongoose, { Document, Schema } from 'mongoose';

export interface IFooterSetting extends Document {
  description: string;
  logo: string;
  socialLinks: {
    platform: string;
    url: string;
  }[];
  menus: {
    title: string;
    links: { label: string; url: string }[];
  }[];
  copyright: string;
  address: string;
  legalLinks: { label: string; url: string }[];
}

const footerSettingSchema = new Schema<IFooterSetting>({
  description: { type: String, required: true },
  logo: { type: String, default: '' },
  socialLinks: [{
    platform: { type: String, required: true },
    url: { type: String, required: true }
  }],
  menus: [{
    title: { type: String, required: true },
    links: [{
      label: { type: String, required: true },
      url: { type: String, required: true }
    }]
  }],
  copyright: { type: String, required: true },
  address: { type: String, required: true },
  legalLinks: [{
    label: { type: String, required: true },
    url: { type: String, required: true }
  }]
}, { timestamps: true });

export const FooterSetting = mongoose.model<IFooterSetting>('FooterSetting', footerSettingSchema);
