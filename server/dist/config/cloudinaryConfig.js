"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCloudinary = initCloudinary;
exports.isCloudinaryConfigured = isCloudinaryConfigured;
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
exports.deleteCloudinaryAsset = deleteCloudinaryAsset;
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
function initCloudinary() {
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (cloudinaryUrl) {
        cloudinary_1.v2.config({ cloudinary_url: cloudinaryUrl });
        return true;
    }
    if (cloudName && apiKey && apiSecret && cloudName !== 'demo' && apiKey !== '894676451677351') {
        cloudinary_1.v2.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true
        });
        return true;
    }
    return false;
}
function isCloudinaryConfigured() {
    return initCloudinary();
}
function uploadBufferToCloudinary(buffer, folder = 'vetnova/media', originalFilename) {
    return new Promise((resolve, reject) => {
        if (!isCloudinaryConfigured()) {
            return reject(new Error('Cloudinary environment variables are missing or unconfigured.'));
        }
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const publicId = originalFilename
            ? `${originalFilename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')}_${uniqueSuffix}`
            : `file_${uniqueSuffix}`;
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder,
            public_id: publicId,
            resource_type: 'auto'
        }, (error, result) => {
            if (error || !result) {
                console.error('Cloudinary stream upload error:', error);
                return reject(error || new Error('Cloudinary upload returned no result'));
            }
            resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
                format: result.format || 'webp',
                bytes: result.bytes || buffer.length,
                resource_type: result.resource_type || 'image'
            });
        });
        stream_1.Readable.from(buffer).pipe(uploadStream);
    });
}
function deleteCloudinaryAsset(publicId) {
    return new Promise((resolve) => {
        if (!isCloudinaryConfigured() || !publicId || publicId.includes('.')) {
            return resolve(null);
        }
        cloudinary_1.v2.uploader.destroy(publicId, (err, res) => {
            if (err) {
                console.warn(`Failed to delete Cloudinary asset ${publicId}:`, err.message || err);
            }
            resolve(res);
        });
    });
}
//# sourceMappingURL=cloudinaryConfig.js.map