import mongoose from 'mongoose';
export declare const Testimonial: mongoose.Model<{
    name: string;
    role: string;
    content: string;
    rating: number;
    image?: string;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    role: string;
    content: string;
    rating: number;
    image?: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    role: string;
    content: string;
    rating: number;
    image?: string;
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
    role: string;
    content: string;
    rating: number;
    image?: string;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    role: string;
    content: string;
    rating: number;
    image?: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    name: string;
    role: string;
    content: string;
    rating: number;
    image?: string;
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
    role: string;
    content: string;
    rating: number;
    image?: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    name: string;
    role: string;
    content: string;
    rating: number;
    image?: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Testimonial.d.ts.map