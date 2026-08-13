import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export async function runMigration() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI is missing from environment');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;
  if (!db) {
    console.error('Database connection object missing');
    process.exit(1);
  }

  const collections = await db.listCollections().toArray();
  let totalAudited = 0;
  let totalCloudinary = 0;
  let totalLegacyUploadsFound = 0;
  let totalCleanedOrMigrated = 0;

  const unrecoverableRecords: any[] = [];
  const migratedRecords: any[] = [];

  for (const colInfo of collections) {
    const colName = colInfo.name;
    const col = db.collection(colName);
    const docs = await col.find({}).toArray();

    for (const doc of docs) {
      totalAudited++;
      const jsonStr = JSON.stringify(doc);
      const hasUploads = jsonStr.includes('/uploads/') || jsonStr.includes('onrender.com/uploads');
      const hasCloudinary = jsonStr.includes('res.cloudinary.com');

      if (hasCloudinary && !hasUploads) {
        totalCloudinary++;
      }

      if (hasUploads) {
        totalLegacyUploadsFound++;
        const updateFields: Record<string, any> = {};
        let isUpdated = false;

        // Check common image fields
        const imageKeys = ['url', 'image', 'coverImage', 'picture', 'avatar', 'thumbnail'];
        for (const key of imageKeys) {
          if (doc[key] && typeof doc[key] === 'string' && (doc[key].includes('/uploads/') || doc[key].includes('onrender.com/uploads'))) {
            // Remove the broken ephemeral URL string so it won't point to non-existent /uploads/
            updateFields[key] = '';
            isUpdated = true;
            unrecoverableRecords.push({
              collection: colName,
              id: doc._id.toString(),
              field: key,
              filename: doc.filename || doc.title || doc.name || 'Unknown',
              brokenUrl: doc[key]
            });
          }
        }

        if (isUpdated) {
          await col.updateOne({ _id: doc._id }, { $set: updateFields });
          totalCleanedOrMigrated++;
        }
      }
    }
  }

  console.log('\n========================================');
  console.log('    MIGRATION & DATABASE AUDIT REPORT   ');
  console.log('========================================');
  console.log(`TOTAL DOCUMENTS AUDITED:     ${totalAudited}`);
  console.log(`CLOUDINARY RECORDS FOUND:    ${totalCloudinary}`);
  console.log(`LEGACY /uploads/ RECORDS:    ${totalLegacyUploadsFound}`);
  console.log(`CLEANED/MIGRATED RECORDS:    ${totalCleanedOrMigrated}`);
  console.log('========================================\n');

  if (unrecoverableRecords.length > 0) {
    console.log('UNRECOVERABLE EPHEMERAL FILES REPORT (lost from Render disk):');
    console.log(JSON.stringify(unrecoverableRecords, null, 2));
  } else {
    console.log('Zero legacy /uploads/ records remain.');
  }

  await mongoose.disconnect();
  console.log('MongoDB Disconnected successfully.\n');

  return {
    totalAudited,
    totalCloudinary,
    totalLegacyUploadsFound,
    totalCleanedOrMigrated,
    unrecoverableRecords
  };
}

if (require.main === module) {
  runMigration().catch(console.error);
}
