import mongoose from 'mongoose';
export declare const Expert: mongoose.Model<{
    name: string;
    designation?: string;
    qualification?: string;
    department?: string;
    specialization?: string;
    experience?: string;
    education?: string;
    bio?: string;
    image?: string;
    email?: string;
    linkedin?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
    };
    programs: string[];
    displayOrder: number;
    status: "Draft" | "Published";
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    designation?: string;
    qualification?: string;
    department?: string;
    specialization?: string;
    experience?: string;
    education?: string;
    bio?: string;
    image?: string;
    email?: string;
    linkedin?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
    };
    programs: string[];
    displayOrder: number;
    status: "Draft" | "Published";
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    designation?: string;
    qualification?: string;
    department?: string;
    specialization?: string;
    experience?: string;
    education?: string;
    bio?: string;
    image?: string;
    email?: string;
    linkedin?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
    };
    programs: string[];
    displayOrder: number;
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
    name: string;
    designation?: string;
    qualification?: string;
    department?: string;
    specialization?: string;
    experience?: string;
    education?: string;
    bio?: string;
    image?: string;
    email?: string;
    linkedin?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
    };
    programs: string[];
    displayOrder: number;
    status: "Draft" | "Published";
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    designation?: string;
    qualification?: string;
    department?: string;
    specialization?: string;
    experience?: string;
    education?: string;
    bio?: string;
    image?: string;
    email?: string;
    linkedin?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
    };
    programs: string[];
    displayOrder: number;
    status: "Draft" | "Published";
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    name: string;
    designation?: string;
    qualification?: string;
    department?: string;
    specialization?: string;
    experience?: string;
    education?: string;
    bio?: string;
    image?: string;
    email?: string;
    linkedin?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
    };
    programs: string[];
    displayOrder: number;
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
    name: string;
    designation?: string;
    qualification?: string;
    department?: string;
    specialization?: string;
    experience?: string;
    education?: string;
    bio?: string;
    image?: string;
    email?: string;
    linkedin?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
    };
    programs: string[];
    displayOrder: number;
    status: "Draft" | "Published";
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    name: string;
    designation?: string;
    qualification?: string;
    department?: string;
    specialization?: string;
    experience?: string;
    education?: string;
    bio?: string;
    image?: string;
    email?: string;
    linkedin?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
    };
    programs: string[];
    displayOrder: number;
    status: "Draft" | "Published";
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Expert.d.ts.map