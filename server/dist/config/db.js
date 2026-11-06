"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sanitizeMongoUri = (uri) => {
    if (!uri)
        return 'undefined';
    return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
};
const connectDB = async () => {
    // Support both MONGO_URI and MONGODB_URI across hosting providers
    const primaryUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    const localUri = 'mongodb://127.0.0.1:27017/vetnova';
    if (primaryUri) {
        try {
            const conn = await mongoose_1.default.connect(primaryUri);
            console.log(`[Database] MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
            return conn;
        }
        catch (primaryError) {
            console.error(`[Database Warning] Primary MongoDB connection failed (${sanitizeMongoUri(primaryUri)}): ${primaryError.message}`);
            if (process.env.NODE_ENV === 'production') {
                console.error('[Database Fatal] Exiting production process due to primary database connection failure.');
                process.exit(1);
            }
            console.log('[Database] Falling back to local MongoDB (127.0.0.1:27017)...');
        }
    }
    try {
        const conn = await mongoose_1.default.connect(localUri);
        console.log(`[Database] MongoDB Connected locally: ${conn.connection.host} (Database: ${conn.connection.name})`);
        return conn;
    }
    catch (error) {
        console.error(`[Database Fatal] Local database connection failed: ${error.message}`);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map