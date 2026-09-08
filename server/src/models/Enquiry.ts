import mongoose, { Document, Schema } from 'mongoose';

export interface IEnquiry extends Document {
  name: string;
  countryCode?: string;
  phone: string;
  email: string;
  profile?: string;
  course?: string;
  message?: string;
  source?: string;
  sourcePage?: string;
  status: 'New' | 'Contacted' | 'Converted' | 'Closed';
  createdAt: Date;
  updatedAt: Date;
}

const enquirySchema = new Schema<IEnquiry>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    countryCode: {
      type: String,
      default: '',
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },
    profile: {
      type: String,
      default: '',
      trim: true
    },
    course: {
      type: String,
      default: '',
      trim: true
    },
    message: {
      type: String,
      default: '',
      trim: true
    },
    source: {
      type: String,
      default: 'website',
      trim: true
    },
    sourcePage: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Converted', 'Closed'],
      default: 'New'
    }
  },
  {
    timestamps: true
  }
);

enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ status: 1 });
enquirySchema.index({ email: 1 });
enquirySchema.index({ phone: 1 });

export const Enquiry = mongoose.model<IEnquiry>('Enquiry', enquirySchema);
