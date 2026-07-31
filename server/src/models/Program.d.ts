import mongoose from 'mongoose';
export declare const Program: mongoose.Model<{
    title: string;
    description: string;
    duration: string;
    learningOutcomes: string[];
    curriculum: mongoose.Types.DocumentArray<{
        title?: string;
        content?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        title?: string;
        content?: string;
    }, {}, {}> & {
        title?: string;
        content?: string;
    }>;
    faculty: mongoose.Types.ObjectId[];
    category: string;
    image?: string;
    isActive: boolean;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    title: string;
    description: string;
    duration: string;
    learningOutcomes: string[];
    curriculum: mongoose.Types.DocumentArray<{
        title?: string;
        content?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        title?: string;
        content?: string;
    }, {}, {}> & {
        title?: string;
        content?: string;
    }>;
    faculty: mongoose.Types.ObjectId[];
    category: string;
    image?: string;
    isActive: boolean;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    title: string;
    description: string;
    duration: string;
    learningOutcomes: string[];
    curriculum: mongoose.Types.DocumentArray<{
        title?: string;
        content?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        title?: string;
        content?: string;
    }, {}, {}> & {
        title?: string;
        content?: string;
    }>;
    faculty: mongoose.Types.ObjectId[];
    category: string;
    image?: string;
    isActive: boolean;
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
    description: string;
    duration: string;
    learningOutcomes: string[];
    curriculum: mongoose.Types.DocumentArray<{
        title?: string;
        content?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        title?: string;
        content?: string;
    }, {}, {}> & {
        title?: string;
        content?: string;
    }>;
    faculty: mongoose.Types.ObjectId[];
    category: string;
    image?: string;
    isActive: boolean;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    title: string;
    description: string;
    duration: string;
    learningOutcomes: string[];
    curriculum: mongoose.Types.DocumentArray<{
        title?: string;
        content?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        title?: string;
        content?: string;
    }, {}, {}> & {
        title?: string;
        content?: string;
    }>;
    faculty: mongoose.Types.ObjectId[];
    category: string;
    image?: string;
    isActive: boolean;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    title: string;
    description: string;
    duration: string;
    learningOutcomes: string[];
    curriculum: mongoose.Types.DocumentArray<{
        title?: string;
        content?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        title?: string;
        content?: string;
    }, {}, {}> & {
        title?: string;
        content?: string;
    }>;
    faculty: mongoose.Types.ObjectId[];
    category: string;
    image?: string;
    isActive: boolean;
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
    description: string;
    duration: string;
    learningOutcomes: string[];
    curriculum: mongoose.Types.DocumentArray<{
        title?: string;
        content?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        title?: string;
        content?: string;
    }, {}, {}> & {
        title?: string;
        content?: string;
    }>;
    faculty: mongoose.Types.ObjectId[];
    category: string;
    image?: string;
    isActive: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    title: string;
    description: string;
    duration: string;
    learningOutcomes: string[];
    curriculum: mongoose.Types.DocumentArray<{
        title?: string;
        content?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        title?: string;
        content?: string;
    }, {}, {}> & {
        title?: string;
        content?: string;
    }>;
    faculty: mongoose.Types.ObjectId[];
    category: string;
    image?: string;
    isActive: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Program.d.ts.map