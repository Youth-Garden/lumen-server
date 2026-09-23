import { v2 as cloudinary } from 'cloudinary';

export interface UploadImageToCloudinaryOptions {
  folder?: string;
  publicId: string;
  overwrite?: boolean;
}

export function ensureCloudinaryConfig(): void {
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
}

export function getCloudinaryWebpImageUrl(
  term: string,
  cloudName?: string,
): string {
  const resolvedCloudName =
    cloudName || process.env.CLOUDINARY_CLOUD_NAME || 'dms9jruo5';
  const sanitizedTerm = term
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '_');
  return `https://res.cloudinary.com/${resolvedCloudName}/image/upload/lumen/vocabulary/images/${sanitizedTerm}.webp`;
}

export async function convertAndUploadImageToWebp(
  source: string,
  options: UploadImageToCloudinaryOptions,
): Promise<string | null> {
  ensureCloudinaryConfig();
  const folder = options.folder || 'lumen/vocabulary/images';
  const sanitizedPublicId = options.publicId
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '_');

  try {
    const uploadResult = await cloudinary.uploader.upload(source, {
      folder,
      public_id: sanitizedPublicId,
      overwrite: options.overwrite ?? true,
      resource_type: 'image',
      format: 'webp',
      transformation: [{ quality: 'auto', fetch_format: 'webp' }],
    });
    return uploadResult.secure_url;
  } catch (error) {
    console.error(
      `Failed to upload/convert image to WebP for ${options.publicId}:`,
      error,
    );
    return null;
  }
}
