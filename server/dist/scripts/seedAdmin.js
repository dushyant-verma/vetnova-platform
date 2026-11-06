"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const db_1 = require("../config/db");
const initAdmin_1 = require("../utils/initAdmin");
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
async function runSeedAdmin() {
    console.log('[SeedAdmin] Connecting to database...');
    await (0, db_1.connectDB)();
    console.log('[SeedAdmin] Ensuring Super Admin account exists...');
    await (0, initAdmin_1.ensureSuperAdminExists)();
    console.log('[SeedAdmin] Super Admin setup complete.');
    await mongoose_1.default.disconnect();
    process.exit(0);
}
runSeedAdmin().catch((err) => {
    console.error('[SeedAdmin Error]:', err);
    process.exit(1);
});
//# sourceMappingURL=seedAdmin.js.map