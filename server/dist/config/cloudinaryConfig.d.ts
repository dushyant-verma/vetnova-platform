export interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    format: string;
    bytes: number;
    resource_type: string;
}
export declare function initCloudinary(): boolean;
export declare function isCloudinaryConfigured(): boolean;
export declare function uploadBufferToCloudinary(buffer: Buffer, folder?: string, originalFilename?: string): Promise<CloudinaryUploadResult>;
export declare function deleteCloudinaryAsset(publicId: string): Promise<any>;
//# sourceMappingURL=cloudinaryConfig.d.ts.map