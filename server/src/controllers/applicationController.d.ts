import { Request, Response } from 'express';
export declare const getApplications: (req: Request, res: Response) => Promise<void>;
export declare const getApplicationById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createApplication: (req: Request, res: Response) => Promise<void>;
export declare const updateApplication: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteApplication: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=applicationController.d.ts.map