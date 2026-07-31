import mongoose from 'mongoose';
export declare const Event: mongoose.Model<{
    title: string;
    description: string;
    date: NativeDate;
    location: string;
    type: "conference" | "webinar" | "workshop";
    image?: string;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    title: string;
    description: string;
    date: NativeDate;
    location: string;
    type: "conference" | "webinar" | "workshop";
    image?: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    title: string;
    description: string;
    date: NativeDate;
    location: string;
    type: "conference" | "webinar" | "workshop";
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
    title: string;
    description: string;
    date: NativeDate;
    location: string;
    type: "conference" | "webinar" | "workshop";
    image?: string;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    title: string;
    description: string;
    date: NativeDate;
    location: string;
    type: "conference" | "webinar" | "workshop";
    image?: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    title: string;
    description: string;
    date: NativeDate;
    location: string;
    type: "conference" | "webinar" | "workshop";
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
    title: string;
    description: string;
    date: NativeDate;
    location: string;
    type: "conference" | "webinar" | "workshop";
    image?: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    title: string;
    description: string;
    date: NativeDate;
    location: string;
    type: "conference" | "webinar" | "workshop";
    image?: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Event.d.ts.map