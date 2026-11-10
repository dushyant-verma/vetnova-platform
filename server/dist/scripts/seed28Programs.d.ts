export interface ProgramSeedData {
    order: number;
    title: string;
    slug: string;
    category: string;
    duration: string;
    learningLevel?: string;
    level?: string;
    levels?: string[];
    description: string;
    image: string;
    status: "Draft" | "Published";
    syllabusStatus: "Available" | "Pending";
    syllabusStatusByLevel?: {
        foundation: "Available" | "Pending";
        intermediate: "Available" | "Pending";
        advanced: "Available" | "Pending";
    };
    stageTitles?: {
        foundation: string;
        intermediate: string;
        advanced: string;
    };
    stageDescriptions?: {
        foundation: string;
        intermediate: string;
        advanced: string;
    };
    syllabus: {
        foundation: string[];
        intermediate: string[];
        advanced: string[];
    };
    learningOutcomes: string[];
    legacyMatches?: string[];
}
export declare const programs28Data: ProgramSeedData[];
export declare function seed28Programs(): Promise<void>;
//# sourceMappingURL=seed28Programs.d.ts.map