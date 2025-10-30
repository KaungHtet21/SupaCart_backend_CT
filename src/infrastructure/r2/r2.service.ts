import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class R2Service {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${this.configService.get('r2.accountId')}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.configService.get('r2.accessKeyId'),
        secretAccessKey: this.configService.get('r2.secretAccessKey'),
      },
    });
  }

  async uploadFile(file: Buffer, fileName: string, contentType: string): Promise<string> {
    const key = `uploads/${uuidv4()}-${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: this.configService.get('r2.bucketName'),
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await this.s3Client.send(command);
    
    // Return the public URL
    return `${this.configService.get('r2.publicUrl')}/${key}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    // Extract key from URL
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // Remove leading slash
    
    const command = new DeleteObjectCommand({
      Bucket: this.configService.get('r2.bucketName'),
      Key: key,
    });

    await this.s3Client.send(command);
  }

  async getSignedUploadUrl(fileName: string, contentType: string): Promise<string> {
    const key = `uploads/${uuidv4()}-${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: this.configService.get('r2.bucketName'),
      Key: key,
      ContentType: contentType,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // 1 hour
  }
}
