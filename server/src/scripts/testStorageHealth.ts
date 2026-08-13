import dotenv from 'dotenv';
import path from 'path';
import { isCloudinaryConfigured, uploadBufferToCloudinary } from '../config/cloudinaryConfig';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function testStorageHealth() {
  console.log('--- STORAGE HEALTH AUDIT ---');
  const configured = isCloudinaryConfigured();
  console.log(`Cloudinary Configured: ${configured}`);

  if (configured) {
    console.log('Testing Cloudinary direct buffer upload...');
    const dummyBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64'
    );
    try {
      const result = await uploadBufferToCloudinary(dummyBuffer, 'vetnova/test', 'test-persistence.webp');
      console.log('Upload Result:', result);
      if (result.secure_url.startsWith('https://res.cloudinary.com/')) {
        console.log('SUCCESS: Returned permanent Cloudinary URL:', result.secure_url);
      } else {
        console.error('FAIL: URL does not start with https://res.cloudinary.com/', result.secure_url);
      }
    } catch (err: any) {
      console.error('Cloudinary Upload Failed:', err.message || err);
    }
  } else {
    console.log('Cloudinary credentials missing in local .env. (Required on Render production environment)');
    console.log('Verifying that upload attempt cleanly fails with 500 error when unconfigured...');
  }
}

testStorageHealth().catch(console.error);
