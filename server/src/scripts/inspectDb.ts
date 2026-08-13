import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function inspectDb() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI missing');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;
  if (!db) {
    console.error('db missing');
    process.exit(1);
  }

  const collections = await db.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name));

  const targetFilename = 'file-1786614401052-778158139.webp';

  const matches: any[] = [];
  const uploadsMatches: any[] = [];

  for (const colInfo of collections) {
    const colName = colInfo.name;
    const col = db.collection(colName);
    const docs = await col.find({}).toArray();

    for (const doc of docs) {
      const jsonStr = JSON.stringify(doc);
      if (jsonStr.includes(targetFilename)) {
        matches.push({
          collection: colName,
          doc: doc
        });
      }
      if (jsonStr.includes('/uploads/') || jsonStr.includes('onrender.com/uploads')) {
        uploadsMatches.push({
          collection: colName,
          id: doc._id,
          doc: doc
        });
      }
    }
  }

  console.log('\n--- TARGET FILENAME MATCHES ---');
  console.log(JSON.stringify(matches, null, 2));

  console.log('\n--- ALL UPLOADS MATCHES ---');
  console.log(`Count: ${uploadsMatches.length}`);
  console.log(JSON.stringify(uploadsMatches, null, 2));

  await mongoose.disconnect();
}

inspectDb().catch(console.error);
