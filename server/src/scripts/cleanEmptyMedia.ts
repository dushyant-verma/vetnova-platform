import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function cleanEmptyMedia() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) process.exit(1);

  await mongoose.connect(mongoUri);
  const db = mongoose.connection.db;
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
  await mongoose.disconnect();
}

cleanEmptyMedia().catch(console.error);
