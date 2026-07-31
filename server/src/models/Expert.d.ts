import mongoose from 'mongoose';
export declare const Expert: mongoose.Model<{
    name: string;
    specialization: string;
    experience?: string;
    education?: string;
    bio?: string;
    image?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
    };
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    specialization: string;
    experience?: string;
    education?: string;
    bio?: string;
    image?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
    };
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    specialization: string;
    experience?: string;
    education?: string;
    bio?: string;
    image?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
    };
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
    specialization: string;
    experience?: string;
    education?: string;
    bio?: string;
    image?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
    };
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    specialization: string;
    experience?: string;
    education?: string;
    bio?: string;
    image?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
    };
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    name: string;
    specialization: string;
    experience?: string;
    education?: string;
    bio?: string;
    image?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
    };
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
    specialization: string;
    experience?: string;
    education?: string;
    bio?: string;
    image?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
    };
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    name: string;
    specialization: string;
    experience?: string;
    education?: string;
    bio?: string;
    image?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
    };
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Expert.d.ts.map