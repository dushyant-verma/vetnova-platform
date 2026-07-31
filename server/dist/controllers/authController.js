"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.authUser = void 0;
const User_1 = require("../models/User");
const generateToken_1 = require("../utils/generateToken");
const authUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.User.findOne({ email });
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
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.authUser = authUser;
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User_1.User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const user = await User_1.User.create({ name, email, password });
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
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.registerUser = registerUser;
//# sourceMappingURL=authController.js.map