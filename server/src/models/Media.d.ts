import mongoose from 'mongoose';
export declare const Media: mongoose.Model<{
    filename: string;
    url: string;
    public_id?: string;
    format?: string;
    size?: number;
    folder: string;
    altText?: string;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    filename: string;
    url: string;
    public_id?: string;
    format?: string;
    size?: number;
    folder: string;
    altText?: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    filename: string;
    url: string;
    public_id?: string;
    format?: string;
    size?: number;
    folder: string;
    altText?: string;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    filename: string;
    url: string;
    public_id?: string;
    format?: string;
    size?: number;
    folder: string;
    altText?: string;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    filename: string;
    url: string;
    public_id?: string;
    format?: string;
    size?: number;
    folder: string;
    altText?: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    filename: string;
    url: string;
    public_id?: string;
    format?: string;
    size?: number;
    folder: string;
    altText?: string;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    filename: string;
    url: string;
    public_id?: string;
    format?: string;
    size?: number;
    folder: string;
    altText?: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    filename: string;
    url: string;
    public_id?: string;
    format?: string;
    size?: number;
    folder: string;
    altText?: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Media.d.ts.map