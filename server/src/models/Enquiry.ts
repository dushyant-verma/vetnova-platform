import mongoose, { Document, Schema } from 'mongoose';

export interface INote {
  text: string;
  author?: string;
  createdAt: Date;
}

export type LeadPersona = 'student' | 'practitioner' | 'nurse' | 'partner' | 'general';
export type LeadStatus = 'New' | 'Contacted' | 'Follow-up Required' | 'Qualified' | 'Closed' | 'Converted';

export interface IEnquiry extends Document {
  leadId: string;
  persona: LeadPersona;
  name: string;
  firstName?: string;
  lastName?: string;
  audience?: string;
  programName?: string;
  designation?: string;
  organization?: string;
  countryCode?: string;
  phone: string;
  email?: string;
  profile?: string;
  course?: string;
  message?: string;
  formData?: Record<string, any>;
  notes: INote[];
  source?: string;
  sourcePage?: string;
  formId?: string;
  status: LeadStatus;
  notificationStatus?: 'Sent' | 'Failed' | 'NotConfigured';
  createdAt: Date;
  updatedAt: Date;
}

const enquirySchema = new Schema<IEnquiry>(
  {
    leadId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    persona: {
      type: String,
      enum: ['student', 'practitioner', 'nurse', 'partner', 'general'],
      default: 'general',
      index: true
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    firstName: {
      type: String,
      default: '',
      trim: true
    },
    lastName: {
      type: String,
      default: '',
      trim: true
    },
    audience: {
      type: String,
      default: '',
      trim: true,
      index: true
    },
    programName: {
      type: String,
      default: '',
      trim: true
    },
    designation: {
      type: String,
      default: '',
      trim: true
    },
    organization: {
      type: String,
      default: '',
      trim: true
    },
    countryCode: {
      type: String,
      default: '+91',
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      default: '',
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
    formData: {
      type: Schema.Types.Mixed,
      default: {}
    },
    notes: [
      {
        text: { type: String, required: true },
        author: { type: String, default: 'Admin' },
        createdAt: { type: Date, default: Date.now }
      }
    ],
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
    formId: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Follow-up Required', 'Qualified', 'Closed', 'Converted'],
      default: 'New',
      index: true
    },
    notificationStatus: {
      type: String,
      enum: ['Sent', 'Failed', 'NotConfigured'],
      default: 'NotConfigured'
    }
  },
  {
    timestamps: true
  }
);

enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ email: 1 });
enquirySchema.index({ phone: 1 });
enquirySchema.index({ organization: 1 });

export const Enquiry = mongoose.model<IEnquiry>('Enquiry', enquirySchema);
