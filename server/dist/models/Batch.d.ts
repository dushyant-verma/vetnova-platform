import mongoose, { Document } from 'mongoose';
export interface IBatch extends Document {
    batchTitle?: string;
    programName: string;
    programSlug?: string;
    programId?: mongoose.Types.ObjectId;
    facultyName: string;
    facultyId?: mongoose.Types.ObjectId;
    startDate: Date;
    endDate?: Date;
    duration: string;
    status: 'Upcoming' | 'Ongoing' | 'Completed';
    seatStatus?: string;
    location?: string;
    maxSeats?: number;
    notes?: string;
    displayOrder?: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Batch: mongoose.Model<IBatch, {}, {}, {}, Document<unknown, {}, IBatch, {}, mongoose.DefaultSchemaOptions> & IBatch & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBatch>;
//# sourceMappingURL=Batch.d.ts.map