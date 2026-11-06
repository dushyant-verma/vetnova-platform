import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { generateToken } from '../utils/generateToken';

export const authUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      res.status(400).json({ success: false, message: 'Email and password cannot be empty' });
      return;
    }

    // Check database connection state
    if (mongoose.connection.readyState !== 1) {
      console.error(`[Auth Error] Database connection is not ready. Current state: ${mongoose.connection.readyState}`);
      res.status(503).json({ success: false, message: 'Database service unavailable. Please try again shortly.' });
      return;
    }

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    if ((user as any).isActive === false) {
      res.status(401).json({ success: false, message: 'Account has been deactivated' });
      return;
    }

    let isMatch = false;
    try {
      isMatch = await (user as any).matchPassword(cleanPassword);
    } catch (pwError: any) {
      console.error(`[Auth Error] Password comparison error for user ${cleanEmail}:`, pwError.message || pwError);
      res.status(500).json({ success: false, message: 'Authentication verification failed' });
      return;
    }

    if (isMatch) {
      let token: string;
      try {
        token = generateToken(user._id.toString(), user.role);
      } catch (jwtError: any) {
        console.error(`[Auth Error] Token generation failed for user ${cleanEmail}:`, jwtError.message || jwtError);
        res.status(500).json({ success: false, message: 'Token generation failed' });
        return;
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error: any) {
    console.error('[Auth Error] Unexpected error during login process:', error.message || error);
    res.status(500).json({ success: false, message: 'Authentication error' });
  }
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required' });
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const userExists = await User.findOne({ email: cleanEmail });

    if (userExists) {
      res.status(400).json({ success: false, message: 'User already exists' });
      return;
    }

    // Restrict registration role self-assignment to standard 'admin' or lower
    const assignedRole = role === 'super_admin' ? 'admin' : (role || 'admin');

    const user = await User.create({
      name: String(name).trim().slice(0, 100),
      email: cleanEmail,
      password,
      role: assignedRole
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString(), user.role),
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error registering user' });
  }
};

export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    res.json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
};

export const refreshToken = async (req: any, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    const newToken = generateToken(req.user._id.toString(), req.user.role);
    res.json({
      success: true,
      token: newToken,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error refreshing token' });
  }
};

export const verifyToken = async (req: any, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, valid: false });
      return;
    }
    res.json({
      success: true,
      valid: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error: any) {
    res.status(401).json({ success: false, valid: false });
  }
};
