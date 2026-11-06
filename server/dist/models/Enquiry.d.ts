import mongoose, { Document } from 'mongoose';
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
export declare const Enquiry: mongoose.Model<IEnquiry, {}, {}, {}, Document<unknown, {}, IEnquiry, {}, mongoose.DefaultSchemaOptions> & IEnquiry & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IEnquiry>;
//# sourceMappingURL=Enquiry.d.ts.map