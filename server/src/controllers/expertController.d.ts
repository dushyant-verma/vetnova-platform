import { Request, Response } from 'express';
export declare const getExperts: (req: Request, res: Response) => Promise<void>;
export declare const getExpertById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createExpert: (req: Request, res: Response) => Promise<void>;
export declare const updateExpert: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteExpert: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=expertController.d.ts.map