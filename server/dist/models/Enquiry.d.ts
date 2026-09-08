import mongoose, { Document } from 'mongoose';
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
export declare const Enquiry: mongoose.Model<IEnquiry, {}, {}, {}, Document<unknown, {}, IEnquiry, {}, mongoose.DefaultSchemaOptions> & IEnquiry & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IEnquiry>;
//# sourceMappingURL=Enquiry.d.ts.map