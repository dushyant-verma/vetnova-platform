import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from '../config/db';
import { ensureSuperAdminExists } from '../utils/initAdmin';
import mongoose from 'mongoose';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function runSeedAdmin() {
  console.log('[SeedAdmin] Connecting to database...');
  await connectDB();
  console.log('[SeedAdmin] Ensuring Super Admin account exists...');
  await ensureSuperAdminExists();
  console.log('[SeedAdmin] Super Admin setup complete.');
  await mongoose.disconnect();
  process.exit(0);
}

runSeedAdmin().catch((err) => {
  console.error('[SeedAdmin Error]:', err);
  process.exit(1);
});

