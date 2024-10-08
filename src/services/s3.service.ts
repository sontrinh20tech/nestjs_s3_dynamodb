import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUploadFile } from 'src/interfaces/file';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_S3_REGION'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_S3_SECRET_ACCESS_KEY',
        ),
      },
      endpoint: this.configService.get<string>('AWS_S3_ENDPOINT'),
    });
  }

  async uploadFileToPublicBucket(prop: IUploadFile) {
    const bucket_name = this.configService.get<string>('AWS_S3_PUBLIC_BUCKET');
    const key = `${prop.path}/${Date.now().toString()}-${prop?.file?.originalname}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket_name,
        Key: key,
        Body: prop.file.buffer,
        ContentType: prop.file.mimetype,
        ACL: 'public-read',
        ContentLength: prop.file.size,
      }),
    );

    return {
      message: 'File uploaded successfully',
      filename: key,
    };
  }

  async deleteFileFromPublicBucket(key: string) {
    const bucket_name = this.configService.get<string>('AWS_S3_PUBLIC_BUCKET');

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket_name,
        Key: key,
      }),
    );

    return {
      message: 'File deleted successfully',
      filename: key,
    };
  }

  async getFileFromPublicBucket(key: string) {
    const bucket_name = this.configService.get<string>('AWS_S3_PUBLIC_BUCKET');

    const res = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: bucket_name,
        Key: key,
      }),
    );

    return res.Body as Readable;
  }
}
