import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = this.configService.get<string>(
      'infrastructure.r2.accessKey',
    )!;
    const secretAccessKey = this.configService.get<string>(
      'infrastructure.r2.secretKey',
    )!;
    const endpoint = this.configService.get<string>(
      'infrastructure.r2.endpoint',
    )!;

    this.bucketName = this.configService.get<string>(
      'infrastructure.r2.bucket',
    )!;
    this.publicUrl = this.configService.get<string>(
      'infrastructure.r2.publicUrl',
    )!;

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
