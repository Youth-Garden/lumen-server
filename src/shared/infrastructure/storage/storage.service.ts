import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor(private readonly configService: ConfigService) {
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

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType,
      });

      await this.s3Client.send(command);

      // Return public URL
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
      .filter((f) => f.endsWith('.mp3'));
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
