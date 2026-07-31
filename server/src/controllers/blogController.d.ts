import { Request, Response } from 'express';
export declare const getBlogs: (req: Request, res: Response) => Promise<void>;
export declare const getBlogById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createBlog: (req: Request, res: Response) => Promise<void>;
export declare const updateBlog: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteBlog: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=blogController.d.ts.map