"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.authUser = void 0;
const User_1 = require("../models/User");
const generateToken_1 = require("../utils/generateToken");
const authUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required' });
            return;
        }
        const cleanEmail = String(email).trim().toLowerCase();
        const user = await User_1.User.findOne({ email: cleanEmail });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: (0, generateToken_1.generateToken)(user._id.toString(), user.role),
            });
        }
        else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Authentication error' });
    }
};
exports.authUser = authUser;
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: 'Name, email, and password are required' });
            return;
        }
        const cleanEmail = String(email).trim().toLowerCase();
        const userExists = await User_1.User.findOne({ email: cleanEmail });
        if (userExists) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }
        // Restrict registration role self-assignment to standard 'admin' or lower
        const assignedRole = role === 'super_admin' ? 'admin' : (role || 'admin');
        const user = await User_1.User.create({
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
                token: (0, generateToken_1.generateToken)(user._id.toString(), user.role),
            });
        }
        else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error registering user' });
    }
};
exports.registerUser = registerUser;
//# sourceMappingURL=authController.js.map