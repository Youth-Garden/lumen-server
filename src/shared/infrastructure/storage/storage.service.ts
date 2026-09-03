import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;
  private isCloudinaryConfigured = false;

  constructor(private readonly configService: ConfigService) {
    const cloudName =
      this.configService.get<string>('CLOUDINARY_CLOUD_NAME') ||
      this.configService.get<string>('infrastructure.cloudinary.cloudName') ||
      process.env.CLOUDINARY_CLOUD_NAME ||
      '';
    const apiKey =
      this.configService.get<string>('CLOUDINARY_API_KEY') ||
      this.configService.get<string>('infrastructure.cloudinary.apiKey') ||
      process.env.CLOUDINARY_API_KEY ||
      '';
    const apiSecret =
      this.configService.get<string>('CLOUDINARY_API_SECRET') ||
      this.configService.get<string>('infrastructure.cloudinary.apiSecret') ||
      process.env.CLOUDINARY_API_SECRET ||
      '';

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      this.isCloudinaryConfigured = true;
      this.logger.log('StorageService initialized with Cloudinary provider.');
    }

    const accessKeyId =
      this.configService.get<string>('R2_ACCESS_KEY') ||
      this.configService.get<string>('infrastructure.r2.accessKey') ||
      process.env.R2_ACCESS_KEY ||
      '';
    const secretAccessKey =
      this.configService.get<string>('R2_SECRET_KEY') ||
      this.configService.get<string>('infrastructure.r2.secretKey') ||
      process.env.R2_SECRET_KEY ||
      '';
    const endpoint =
      this.configService.get<string>('R2_ENDPOINT') ||
      this.configService.get<string>('infrastructure.r2.endpoint') ||
      process.env.R2_ENDPOINT ||
      '';

    this.bucketName =
      this.configService.get<string>('R2_BUCKET_NAME') ||
      this.configService.get<string>('infrastructure.r2.bucket') ||
      process.env.R2_BUCKET_NAME ||
      'lumen-bucket';

    this.publicUrl =
      this.configService.get<string>('R2_PUBLIC_URL') ||
      this.configService.get<string>('infrastructure.r2.publicUrl') ||
      process.env.R2_PUBLIC_URL ||
      'https://f005.backblazeb2.com/file/lumen-bucket';

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  private getResourceType(
    contentType: string,
  ): 'image' | 'video' | 'raw' | 'auto' {
    if (contentType.startsWith('image/')) return 'image';
    if (contentType.startsWith('audio/') || contentType.startsWith('video/'))
      return 'video';
    return 'raw';
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string,
  ): Promise<string> {
    if (this.isCloudinaryConfigured) {
      return new Promise<string>((resolve, reject) => {
        const folder = path.dirname(fileName);
        const publicId = path.basename(fileName, path.extname(fileName));
        const resourceType = this.getResourceType(contentType);

        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder === '.' ? 'lumen' : `lumen/${folder}`,
            public_id: publicId,
            resource_type: resourceType,
          },
          (error, result: UploadApiResponse | undefined) => {
            if (error || !result) {
              this.logger.error(
                `Failed to upload file ${fileName} to Cloudinary`,
                error,
              );
              reject(
                (error as Error) ||
                  new Error(`Failed to upload ${fileName} to Cloudinary`),
              );
            } else {
              resolve(result.secure_url);
            }
          },
        );
        uploadStream.end(fileBuffer);
      });
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType,
      });

      await this.s3Client.send(command);
      return `${this.publicUrl}/${fileName}`;
    } catch (error) {
      this.logger.error(`Failed to upload file ${fileName} to R2`, error);
      throw error;
    }
  }

  async uploadStream(
    fileStream: fs.ReadStream,
    fileName: string,
    contentType: string,
  ): Promise<string> {
    if (this.isCloudinaryConfigured) {
      return new Promise<string>((resolve, reject) => {
        const folder = path.dirname(fileName);
        const publicId = path.basename(fileName, path.extname(fileName));
        const resourceType = this.getResourceType(contentType);

        const upload = cloudinary.uploader.upload_stream(
          {
            folder: folder === '.' ? 'lumen' : `lumen/${folder}`,
            public_id: publicId,
            resource_type: resourceType,
          },
          (error, result: UploadApiResponse | undefined) => {
            if (error || !result) {
              this.logger.error(
                `Failed to upload stream ${fileName} to Cloudinary`,
                error,
              );
              reject(
                (error as Error) ||
                  new Error(
                    `Failed to upload stream ${fileName} to Cloudinary`,
                  ),
              );
            } else {
              resolve(result.secure_url);
            }
          },
        );
        fileStream.pipe(upload);
      });
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileStream,
        ContentType: contentType,
      });

      await this.s3Client.send(command);
      return `${this.publicUrl}/${fileName}`;
    } catch (error) {
      this.logger.error(`Failed to upload stream ${fileName} to R2`, error);
      throw error;
    }
  }

  async uploadAudioDirectory(
    directoryPath: string,
  ): Promise<Record<string, string>> {
    const urlMap: Record<string, string> = {};

    if (!fs.existsSync(directoryPath)) {
      this.logger.warn(`Directory does not exist: ${directoryPath}`);
      return urlMap;
    }

    const files = fs
      .readdirSync(directoryPath)
      .filter((file) => file.endsWith('.mp3'));
    this.logger.log(`Uploading ${files.length} audio files to storage...`);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stream = fs.createReadStream(filePath);
      const objectKey = `audio/${file}`;

      try {
        const publicUrl = await this.uploadStream(
          stream,
          objectKey,
          'audio/mpeg',
        );
        urlMap[file] = publicUrl;
        this.logger.log(`Uploaded ${file} -> ${publicUrl}`);
      } catch (error) {
        this.logger.error(`Error uploading ${file}:`, error);
      }
    }

    return urlMap;
  }

  async getPresignedUploadUrl(
    fileName: string,
    contentType: string,
    expiresIn = 3600,
  ): Promise<string> {
    if (this.isCloudinaryConfigured) {
      const folder = path.dirname(fileName);
      const publicId = path.basename(fileName, path.extname(fileName));
      const timestamp = Math.round(new Date().getTime() / 1000);
      const apiSecret =
        this.configService.get<string>('CLOUDINARY_API_SECRET') ||
        process.env.CLOUDINARY_API_SECRET ||
        '';
      const targetFolder = folder === '.' ? 'lumen' : `lumen/${folder}`;

      const signature = cloudinary.utils.api_sign_request(
        {
          timestamp,
          folder: targetFolder,
          public_id: publicId,
        },
        apiSecret,
      );

      return `https://api.cloudinary.com/v1_1/${cloudinary.config().cloud_name}/auto/upload?timestamp=${timestamp}&public_id=${publicId}&folder=${targetFolder}&signature=${signature}&api_key=${cloudinary.config().api_key}`;
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        ContentType: contentType,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      this.logger.error(
        `Failed to generate presigned URL for ${fileName}`,
        error,
      );
      throw error;
    }
  }
}
