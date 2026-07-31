import mongoose from 'mongoose';
export declare const Application: mongoose.Model<{
    name: string;
    email: string;
    phone: string;
    qualification: string;
    program: mongoose.Types.ObjectId;
    status: "Approved" | "Pending" | "Rejected";
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    phone: string;
    qualification: string;
    program: mongoose.Types.ObjectId;
    status: "Approved" | "Pending" | "Rejected";
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    email: string;
    phone: string;
    qualification: string;
    program: mongoose.Types.ObjectId;
    status: "Approved" | "Pending" | "Rejected";
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    email: string;
    phone: string;
    qualification: string;
    program: mongoose.Types.ObjectId;
    status: "Approved" | "Pending" | "Rejected";
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    phone: string;
    qualification: string;
    program: mongoose.Types.ObjectId;
    status: "Approved" | "Pending" | "Rejected";
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    name: string;
    email: string;
    phone: string;
    qualification: string;
    program: mongoose.Types.ObjectId;
    status: "Approved" | "Pending" | "Rejected";
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    name: string;
    email: string;
    phone: string;
    qualification: string;
    program: mongoose.Types.ObjectId;
    status: "Approved" | "Pending" | "Rejected";
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    name: string;
    email: string;
    phone: string;
    qualification: string;
    program: mongoose.Types.ObjectId;
    status: "Approved" | "Pending" | "Rejected";
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Application.d.ts.map