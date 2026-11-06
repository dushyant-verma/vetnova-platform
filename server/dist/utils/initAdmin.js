"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureSuperAdminExists = ensureSuperAdminExists;
const User_1 = require("../models/User");
const Program_1 = require("../models/Program");
const seedWebsiteContent_1 = require("../scripts/seedWebsiteContent");
const seed28Programs_1 = require("../scripts/seed28Programs");
async function ensureSuperAdminExists() {
    try {
        const adminEmail = (process.env.ADMIN_EMAIL || 'admin@vetnova.edu.in').trim().toLowerCase();
        const adminPassword = (process.env.ADMIN_PASSWORD || process.env.DEFAULT_ADMIN_PASSWORD || 'admin123').trim();
        const adminName = (process.env.ADMIN_NAME || 'Super Admin').trim();
        const forceReset = process.env.RESET_ADMIN_PASSWORD === 'true';
        let admin = await User_1.User.findOne({ email: adminEmail });
        if (!admin) {
            admin = await User_1.User.create({
                name: adminName,
                email: adminEmail,
                password: adminPassword,
                role: 'super_admin',
                isActive: true
            });
            console.log(`[Auth Init] Super Admin account created: ${adminEmail}`);
        }
        else {
            let shouldSave = false;
            if (admin.role !== 'super_admin') {
                admin.role = 'super_admin';
                shouldSave = true;
            }
            if (admin.isActive === false) {
                admin.isActive = true;
                shouldSave = true;
            }
            if (forceReset) {
                admin.password = adminPassword; // pre('save') hashes it safely
                shouldSave = true;
                console.log(`[Auth Init] Super Admin password reset from environment for: ${adminEmail}`);
            }
            if (shouldSave) {
                await admin.save();
                console.log(`[Auth Init] Super Admin account privileges updated for: ${adminEmail}`);
            }
            else {
                console.log(`[Auth Init] Super Admin account verified: ${adminEmail}`);
            }
        }
        // Auto-bootstrap content if catalog is empty
        try {
            const programCount = await Program_1.Program.countDocuments();
            if (programCount === 0) {
                console.log('[Bootstrap] Empty database detected. Seeding initial catalog & website content...');
                await (0, seedWebsiteContent_1.seedWebsiteContent)();
                await (0, seed28Programs_1.seed28Programs)();
                console.log('[Bootstrap] Initial catalog & website content seeding completed successfully.');
            }
        }
        catch (seedErr) {
            console.warn('[Bootstrap Warning] Auto-seeding catalog skipped:', seedErr.message);
        }
    }
    catch (error) {
        console.error('[Auth Init Error] Failed to initialize Super Admin account:', error.message);
    }
}
//# sourceMappingURL=initAdmin.js.map