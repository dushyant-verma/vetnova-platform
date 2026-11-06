import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      const parts = authHeader.split(' ');
      if (parts.length < 2) {
        res.status(401).json({ success: false, message: 'Not authorized, no token provided', code: 'NO_TOKEN' });
        return;
      }
      token = parts[1]?.trim();

      if (!token || token === 'undefined' || token === 'null' || token === '') {
        res.status(401).json({ success: false, message: 'Not authorized, invalid token format', code: 'INVALID_TOKEN' });
        return;
      }

      const jwtSecret = process.env.JWT_SECRET;
      
      if (!jwtSecret && process.env.NODE_ENV === 'production') {
        res.status(500).json({ success: false, message: 'Server authentication configuration error' });
        return;
      }

      const decoded: any = jwt.verify(token, jwtSecret || 'secret123');
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401).json({ success: false, message: 'User account no longer exists', code: 'USER_NOT_FOUND' });
        return;
      }

      req.user = user;
      next();
      return;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({ 
          success: false, 
          message: 'Not authorized, token failed or expired', 
          error: 'TokenExpired',
          code: 'TOKEN_EXPIRED' 
        });
        return;
      }
      res.status(401).json({ 
        success: false, 
        message: 'Not authorized, token failed or expired', 
        error: error.message,
        code: 'TOKEN_INVALID' 
      });
      return;
    }
  }

  res.status(401).json({ success: false, message: 'Not authorized, no token provided', code: 'NO_TOKEN' });
  return;
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as an admin' });
  }
};

export const superAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'super_admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Operation requires Super Admin privileges' });
  }
};
