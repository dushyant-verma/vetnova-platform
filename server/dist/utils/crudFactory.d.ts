import { Request, Response } from 'express';
import { Model } from 'mongoose';
export declare const crudFactory: (model: Model<any>, populateOpts?: any) => {
    getAll: (req: Request, res: Response) => Promise<void>;
    getOne: (req: Request, res: Response) => Promise<void>;
    createOne: (req: Request, res: Response) => Promise<void>;
    updateOne: (req: Request, res: Response) => Promise<void>;
    deleteOne: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=crudFactory.d.ts.map