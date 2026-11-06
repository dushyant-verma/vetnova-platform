import mongoose from 'mongoose';
import { User } from '../models/User';
import { Program } from '../models/Program';
import { Batch } from '../models/Batch';
import { seedWebsiteContent } from '../scripts/seedWebsiteContent';
import { seed28Programs } from '../scripts/seed28Programs';

export async function seedDefaultBatches(): Promise<void> {
  const defaultBatches = [
    {
      batchTitle: 'Soft Tissue Surgery Intensive Cohort 1',
      programName: 'Soft Tissue Surgery Track',
      programSlug: 'soft-tissue-surgery',
      facultyName: 'Dr. Amit Kulkarni',
      startDate: new Date('2026-11-23'),
      endDate: new Date('2026-11-26'),
      duration: '3 Days',
      status: 'Upcoming',
      seatStatus: '🟢 Admissions Open',
      location: 'Pune Campus',
      maxSeats: 12,
      displayOrder: 1
    },
    {
      batchTitle: 'Veterinary Skill-Up Hands-on Cohort 2',
      programName: 'Veterinary Skill-Up Program',
      programSlug: 'veterinary-skill-up',
      facultyName: 'Dr. Priya Sharma',
      startDate: new Date('2026-12-07'),
      endDate: new Date('2026-12-09'),
      duration: '3 Days',
      status: 'Upcoming',
      seatStatus: '🔥 4 Seats Remaining',
      location: 'Pune Campus',
      maxSeats: 12,
      displayOrder: 2
    },
    {
      batchTitle: 'Pet Emergency & Critical Care ICU Cohort',
      programName: 'Pet Emergency & Critical Care',
      programSlug: 'emergency-and-critical-care',
      facultyName: 'Dr. Rajesh Verma',
      startDate: new Date('2026-11-04'),
      endDate: new Date('2026-11-07'),
      duration: '3 Days',
      status: 'Ongoing',
      seatStatus: '🟢 In Session',
      location: 'Pune Campus',
      maxSeats: 12,
      displayOrder: 1
    },
    {
      batchTitle: 'Veterinary Dermatology Clinical Cohort',
      programName: 'Veterinary Dermatology Track',
      programSlug: 'veterinary-dermatology',
      facultyName: 'Dr. Sneha Nair',
      startDate: new Date('2026-11-01'),
      endDate: new Date('2026-11-08'),
      duration: '3 Days',
      status: 'Ongoing',
      seatStatus: '🟢 In Session',
      location: 'Pune Campus',
      maxSeats: 12,
      displayOrder: 2
    }
  ];

  for (const b of defaultBatches) {
    await Batch.findOneAndUpdate(
      { batchTitle: b.batchTitle },
      { $setOnInsert: b },
      { upsert: true, new: true }
    );
  }
}

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

    // Auto-bootstrap batches if collection is empty
    try {
      const batchCount = await Batch.countDocuments();
      if (batchCount === 0) {
        console.log('[Bootstrap] No batches found in DB. Seeding initial practical training batches...');
        await seedDefaultBatches();
        console.log('[Bootstrap] Initial practical training batches seeded successfully.');
      }
    } catch (batchErr: any) {
      console.warn('[Bootstrap Warning] Auto-seeding batches skipped:', batchErr.message);
    }

    console.log(`[Database Health] Initializer complete. Database connection readyState: ${mongoose.connection.readyState}`);
  } catch (error: any) {
    console.error('[Auth Init Error] Failed to initialize Super Admin account:', error.message);
  }
}

