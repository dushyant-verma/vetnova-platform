"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const FALLBACK_MEDIA_MAP = {
    'testimg.webp': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    'blog-vet-nurse-or.webp': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    'equipment_ultrasound.webp': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    'default': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80'
};
async function migrateLegacyImages() {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('MONGO_URI is missing from environment');
            process.exit(1);
        }
        await mongoose_1.default.connect(mongoUri);
        console.log('Connected to MongoDB');
        const db = mongoose_1.default.connection.db;
        if (!db) {
            console.error('Database connection object missing');
            process.exit(1);
        }
        const collections = await db.listCollections().toArray();
        let totalAudited = 0;
        let totalMigrated = 0;
        let totalUnrecoverable = 0;
        let totalAlreadyPermanent = 0;
        const migrationLog = [];
        for (const colInfo of collections) {
            const colName = colInfo.name;
            const col = db.collection(colName);
            const docs = await col.find({}).toArray();
            for (const doc of docs) {
                const jsonStr = JSON.stringify(doc);
                const hasUploads = jsonStr.includes('/uploads/');
                const hasCloudinary = jsonStr.includes('res.cloudinary.com');
                if (!hasUploads && !hasCloudinary)
                    continue;
                totalAudited++;
                if (hasCloudinary && !hasUploads) {
                    totalAlreadyPermanent++;
                    continue;
                }
                if (hasUploads) {
                    let updated = false;
                    const updateFields = {};
                    // Check main image/url fields
                    const currentUrl = doc.url || doc.image || doc.coverImage;
                    let filenameKey = 'default';
                    if (doc.filename) {
                        filenameKey = doc.filename;
                    }
                    else if (typeof currentUrl === 'string') {
                        if (currentUrl.includes('blog-vet-nurse'))
                            filenameKey = 'blog-vet-nurse-or.webp';
                        else if (currentUrl.includes('ultrasound'))
                            filenameKey = 'equipment_ultrasound.webp';
                        else if (currentUrl.includes('testimg'))
                            filenameKey = 'testimg.webp';
                    }
                    const permanentUrl = FALLBACK_MEDIA_MAP[filenameKey] || FALLBACK_MEDIA_MAP['default'];
                    if (doc.url && doc.url.includes('/uploads/')) {
                        updateFields.url = permanentUrl;
                        updated = true;
                    }
                    if (doc.image && doc.image.includes('/uploads/')) {
                        updateFields.image = permanentUrl;
                        updated = true;
                    }
                    if (doc.coverImage && doc.coverImage.includes('/uploads/')) {
                        updateFields.coverImage = permanentUrl;
                        updated = true;
                    }
                    if (updated) {
                        await col.updateOne({ _id: doc._id }, { $set: updateFields });
                        totalMigrated++;
                        totalUnrecoverable++; // ephemeral Render file on disk was lost, safely replaced
                        migrationLog.push({
                            collection: colName,
                            id: doc._id.toString(),
                            title: doc.title || doc.name || doc.filename || 'N/A',
                            oldUrl: currentUrl,
                            newPermanentUrl: permanentUrl
                        });
                    }
                }
            }
        }
        console.log('\n========================================');
        console.log('    MIGRATION & RECOVERY REPORT SUMMARY  ');
        console.log('========================================');
        console.log(`TOTAL RECORDS AUDITED:        ${totalAudited}`);
        console.log(`PERMANENT CLOUDINARY URLS:     ${totalAlreadyPermanent}`);
        console.log(`OLD /uploads/ URLS FOUND:     ${totalMigrated}`);
        console.log(`RECOVERED & REPLACED WITH CDN: ${totalMigrated}`);
        console.log(`LOST EPHEMERAL FILES REPLACED:${totalUnrecoverable}`);
        console.log('========================================\n');
        console.log('Migration Details Log:');
        console.log(JSON.stringify(migrationLog, null, 2));
        await mongoose_1.default.disconnect();
        console.log('\nMongoDB Disconnected successfully.');
    }
    catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}
migrateLegacyImages();
//# sourceMappingURL=migrateLegacyImages.js.map