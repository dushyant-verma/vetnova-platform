import { Request, Response } from 'express';
export declare const authUser: (req: Request, res: Response) => Promise<void>;
export declare const registerUser: (req: Request, res: Response) => Promise<void>;
export declare const getMe: (req: any, res: Response) => Promise<void>;
export declare const refreshToken: (req: any, res: Response) => Promise<void>;
export declare const verifyToken: (req: any, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map