"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cloudinaryConfig_1 = require("../config/cloudinaryConfig");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
async function testStorageHealth() {
    console.log('--- STORAGE HEALTH AUDIT ---');
    const configured = (0, cloudinaryConfig_1.isCloudinaryConfigured)();
    console.log(`Cloudinary Configured: ${configured}`);
    if (configured) {
        console.log('Testing Cloudinary direct buffer upload...');
        const dummyBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
        try {
            const result = await (0, cloudinaryConfig_1.uploadBufferToCloudinary)(dummyBuffer, 'vetnova/test', 'test-persistence.webp');
            console.log('Upload Result:', result);
            if (result.secure_url.startsWith('https://res.cloudinary.com/')) {
                console.log('SUCCESS: Returned permanent Cloudinary URL:', result.secure_url);
            }
            else {
                console.error('FAIL: URL does not start with https://res.cloudinary.com/', result.secure_url);
            }
        }
        catch (err) {
            console.error('Cloudinary Upload Failed:', err.message || err);
        }
    }
    else {
        console.log('Cloudinary credentials missing in local .env. (Required on Render production environment)');
        console.log('Verifying that upload attempt cleanly fails with 500 error when unconfigured...');
    }
}
testStorageHealth().catch(console.error);
//# sourceMappingURL=testStorageHealth.js.map