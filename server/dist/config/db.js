"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const primaryUri = process.env.MONGO_URI;
    const localUri = 'mongodb://127.0.0.1:27017/vetnova';
    if (primaryUri) {
        try {
            const conn = await mongoose_1.default.connect(primaryUri);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            return;
        }
        catch (primaryError) {
            console.error(`[Database Warning] Primary MONGO_URI failed (${primaryError.message}).`);
            if (process.env.NODE_ENV === 'production') {
                process.exit(1);
            }
            console.log('[Database] Falling back to local MongoDB (127.0.0.1:27017)...');
        }
    }
    try {
        const conn = await mongoose_1.default.connect(localUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map