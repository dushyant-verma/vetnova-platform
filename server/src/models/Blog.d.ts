import mongoose from 'mongoose';
export declare const Blog: mongoose.Model<{
    title: string;
    content: string;
    author: string;
    category?: string;
    image?: string;
    status: "Draft" | "Published";
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    title: string;
    content: string;
    author: string;
    category?: string;
    image?: string;
    status: "Draft" | "Published";
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    title: string;
    content: string;
    author: string;
    category?: string;
    image?: string;
    status: "Draft" | "Published";
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    title: string;
    content: string;
    author: string;
    category?: string;
    image?: string;
    status: "Draft" | "Published";
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    title: string;
    content: string;
    author: string;
    category?: string;
    image?: string;
    status: "Draft" | "Published";
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    title: string;
    content: string;
    author: string;
    category?: string;
    image?: string;
    status: "Draft" | "Published";
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    title: string;
    content: string;
    author: string;
    category?: string;
    image?: string;
    status: "Draft" | "Published";
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    title: string;
    content: string;
    author: string;
    category?: string;
    image?: string;
    status: "Draft" | "Published";
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Blog.d.ts.map