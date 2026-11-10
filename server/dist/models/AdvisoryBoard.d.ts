import mongoose from 'mongoose';
export declare const AdvisoryBoard: mongoose.Model<{
    name: string;
    designation?: string;
    organization?: string;
    qualification?: string;
    specialization?: string;
    expertise: string[];
    bio?: string;
    image?: string;
    linkedin?: string;
    displayOrder: number;
    status: "Draft" | "Published";
    fullBio?: any;
    qualifications: mongoose.Types.DocumentArray<{
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }, {}, {}> & {
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }>;
    achievements: string[];
    researchInterests: string[];
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    designation?: string;
    organization?: string;
    qualification?: string;
    specialization?: string;
    expertise: string[];
    bio?: string;
    image?: string;
    linkedin?: string;
    displayOrder: number;
    status: "Draft" | "Published";
    fullBio?: any;
    qualifications: mongoose.Types.DocumentArray<{
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }, {}, {}> & {
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }>;
    achievements: string[];
    researchInterests: string[];
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
    strict: false;
}> & Omit<{
    name: string;
    designation?: string;
    organization?: string;
    qualification?: string;
    specialization?: string;
    expertise: string[];
    bio?: string;
    image?: string;
    linkedin?: string;
    displayOrder: number;
    status: "Draft" | "Published";
    fullBio?: any;
    qualifications: mongoose.Types.DocumentArray<{
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }, {}, {}> & {
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }>;
    achievements: string[];
    researchInterests: string[];
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    strict: false;
}, {
    name: string;
    designation?: string;
    organization?: string;
    qualification?: string;
    specialization?: string;
    expertise: string[];
    bio?: string;
    image?: string;
    linkedin?: string;
    displayOrder: number;
    status: "Draft" | "Published";
    fullBio?: any;
    qualifications: mongoose.Types.DocumentArray<{
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }, {}, {}> & {
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }>;
    achievements: string[];
    researchInterests: string[];
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    designation?: string;
    organization?: string;
    qualification?: string;
    specialization?: string;
    expertise: string[];
    bio?: string;
    image?: string;
    linkedin?: string;
    displayOrder: number;
    status: "Draft" | "Published";
    fullBio?: any;
    qualifications: mongoose.Types.DocumentArray<{
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }, {}, {}> & {
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }>;
    achievements: string[];
    researchInterests: string[];
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "strict" | "timestamps"> & {
    timestamps: true;
    strict: false;
}> & Omit<{
    name: string;
    designation?: string;
    organization?: string;
    qualification?: string;
    specialization?: string;
    expertise: string[];
    bio?: string;
    image?: string;
    linkedin?: string;
    displayOrder: number;
    status: "Draft" | "Published";
    fullBio?: any;
    qualifications: mongoose.Types.DocumentArray<{
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }, {}, {}> & {
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }>;
    achievements: string[];
    researchInterests: string[];
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
    organization?: string;
    qualification?: string;
    specialization?: string;
    expertise: string[];
    bio?: string;
    image?: string;
    linkedin?: string;
    displayOrder: number;
    status: "Draft" | "Published";
    fullBio?: any;
    qualifications: mongoose.Types.DocumentArray<{
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }, {}, {}> & {
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }>;
    achievements: string[];
    researchInterests: string[];
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    name: string;
    designation?: string;
    organization?: string;
    qualification?: string;
    specialization?: string;
    expertise: string[];
    bio?: string;
    image?: string;
    linkedin?: string;
    displayOrder: number;
    status: "Draft" | "Published";
    fullBio?: any;
    qualifications: mongoose.Types.DocumentArray<{
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }, {}, {}> & {
        degree?: string;
        field?: string;
        institution?: string;
        year?: string;
    }>;
    achievements: string[];
    researchInterests: string[];
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=AdvisoryBoard.d.ts.map