import mongoose from "mongoose";
export interface ISyllabus {
    foundation: string[];
    intermediate: string[];
    advanced: string[];
}
export interface IProgram extends mongoose.Document {
    title: string;
    slug: string;
    order?: number;
    description: string;
    shortDescription?: string;
    fullDescription?: string;
    duration?: string;
    availability?: string;
    learningLevel?: "Beginner" | "Intermediate" | "Advanced";
    level?: "Beginner" | "Intermediate" | "Advanced";
    learningOutcomes?: string[];
    curriculum?: {
        title: string;
        content: string;
    }[];
    faculty?: mongoose.Types.ObjectId[];
    category: string;
    image?: string;
    status: "Draft" | "Published";
    syllabusStatus: "Available" | "Pending";
    syllabus: ISyllabus;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Program: mongoose.Model<IProgram, {}, {}, {}, mongoose.Document<unknown, {}, IProgram, {}, mongoose.DefaultSchemaOptions> & IProgram & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProgram>;
//# sourceMappingURL=Program.d.ts.map