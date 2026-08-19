import mongoose from 'mongoose';
export declare const Blog: mongoose.Model<{
    title: string;
    slug?: string;
    content: string;
    excerpt?: string;
    author: string;
    authorRole: string;
    authorImage?: string;
    category: string;
    categories: string[];
    tags: string[];
    image?: string;
    status: "Draft" | "Published";
    isFeatured: boolean;
    readTime: string;
    seoTitle?: string;
    seoDescription?: string;
    ogImage?: string;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    title: string;
    slug?: string;
    content: string;
    excerpt?: string;
    author: string;
    authorRole: string;
    authorImage?: string;
    category: string;
    categories: string[];
    tags: string[];
    image?: string;
    status: "Draft" | "Published";
    isFeatured: boolean;
    readTime: string;
    seoTitle?: string;
    seoDescription?: string;
    ogImage?: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    title: string;
    slug?: string;
    content: string;
    excerpt?: string;
    author: string;
    authorRole: string;
    authorImage?: string;
    category: string;
    categories: string[];
    tags: string[];
    image?: string;
    status: "Draft" | "Published";
    isFeatured: boolean;
    readTime: string;
    seoTitle?: string;
    seoDescription?: string;
    ogImage?: string;
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
    slug?: string;
    content: string;
    excerpt?: string;
    author: string;
    authorRole: string;
    authorImage?: string;
    category: string;
    categories: string[];
    tags: string[];
    image?: string;
    status: "Draft" | "Published";
    isFeatured: boolean;
    readTime: string;
    seoTitle?: string;
    seoDescription?: string;
    ogImage?: string;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    title: string;
    slug?: string;
    content: string;
    excerpt?: string;
    author: string;
    authorRole: string;
    authorImage?: string;
    category: string;
    categories: string[];
    tags: string[];
    image?: string;
    status: "Draft" | "Published";
    isFeatured: boolean;
    readTime: string;
    seoTitle?: string;
    seoDescription?: string;
    ogImage?: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    title: string;
    slug?: string;
    content: string;
    excerpt?: string;
    author: string;
    authorRole: string;
    authorImage?: string;
    category: string;
    categories: string[];
    tags: string[];
    image?: string;
    status: "Draft" | "Published";
    isFeatured: boolean;
    readTime: string;
    seoTitle?: string;
    seoDescription?: string;
    ogImage?: string;
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
    slug?: string;
    content: string;
    excerpt?: string;
    author: string;
    authorRole: string;
    authorImage?: string;
    category: string;
    categories: string[];
    tags: string[];
    image?: string;
    status: "Draft" | "Published";
    isFeatured: boolean;
    readTime: string;
    seoTitle?: string;
    seoDescription?: string;
    ogImage?: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    title: string;
    slug?: string;
    content: string;
    excerpt?: string;
    author: string;
    authorRole: string;
    authorImage?: string;
    category: string;
    categories: string[];
    tags: string[];
    image?: string;
    status: "Draft" | "Published";
    isFeatured: boolean;
    readTime: string;
    seoTitle?: string;
    seoDescription?: string;
    ogImage?: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Blog.d.ts.map