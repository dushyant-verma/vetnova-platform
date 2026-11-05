"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdmin = exports.admin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret && process.env.NODE_ENV === 'production') {
                res.status(500).json({ success: false, message: 'Server authentication configuration error' });
                return;
            }
            const decoded = jsonwebtoken_1.default.verify(token, jwtSecret || 'secret123');
            const user = await User_1.User.findById(decoded.id).select('-password');
            if (!user) {
                res.status(401).json({ success: false, message: 'User account no longer exists' });
                return;
            }
            req.user = user;
            next();
            return;
        }
        catch (error) {
            res.status(401).json({ success: false, message: 'Not authorized, token failed or expired' });
            return;
        }
    }
    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
        return;
    }
};
exports.protect = protect;
const admin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
        next();
    }
    else {
        res.status(403).json({ success: false, message: 'Not authorized as an admin' });
    }
};
exports.admin = admin;
const superAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'super_admin') {
        next();
    }
    else {
        res.status(403).json({ success: false, message: 'Operation requires Super Admin privileges' });
    }
};
exports.superAdmin = superAdmin;
//# sourceMappingURL=authMiddleware.js.map