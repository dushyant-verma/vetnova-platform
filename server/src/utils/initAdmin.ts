import mongoose from 'mongoose';
import { User } from '../models/User';
import { Program } from '../models/Program';
import { seedWebsiteContent } from '../scripts/seedWebsiteContent';
import { seed28Programs } from '../scripts/seed28Programs';

export async function ensureSuperAdminExists(): Promise<void> {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@vetnova.edu.in').trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || process.env.DEFAULT_ADMIN_PASSWORD || 'admin123').trim();
    const adminName = (process.env.ADMIN_NAME || 'Super Admin').trim();
    const forceReset = process.env.RESET_ADMIN_PASSWORD === 'true';

    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'super_admin',
        isActive: true
      });
      console.log(`[Auth Init] Super Admin account created: ${adminEmail}`);
    } else {
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
      } else {
        console.log(`[Auth Init] Super Admin account verified: ${adminEmail}`);
      }
    }

    // Auto-bootstrap content if catalog is empty
    try {
      const programCount = await Program.countDocuments();
      if (programCount === 0) {
        console.log('[Bootstrap] Empty database detected. Seeding initial catalog & website content...');
        await seedWebsiteContent();
        await seed28Programs();
        console.log('[Bootstrap] Initial catalog & website content seeding completed successfully.');
      }
    } catch (seedErr: any) {
      console.warn('[Bootstrap Warning] Auto-seeding catalog skipped:', seedErr.message);
    }

    console.log(`[Database Health] Initializer complete. Database connection readyState: ${mongoose.connection.readyState}`);
  } catch (error: any) {
    console.error('[Auth Init Error] Failed to initialize Super Admin account:', error.message);
  }
}

