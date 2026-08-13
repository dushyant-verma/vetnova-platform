"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
async function cleanEmptyMedia() {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri)
        process.exit(1);
    await mongoose_1.default.connect(mongoUri);
    const db = mongoose_1.default.connection.db;
    if (db) {
        const res = await db.collection('media').deleteMany({
            $or: [
                { url: '' },
                { url: { $exists: false } },
                { url: null },
                { url: { $regex: '/uploads/' } }
            ]
        });
        console.log(`Deleted ${res.deletedCount} empty/legacy media documents.`);
    }
    await mongoose_1.default.disconnect();
}
cleanEmptyMedia().catch(console.error);
//# sourceMappingURL=cleanEmptyMedia.js.map