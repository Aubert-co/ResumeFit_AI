import {  Injectable } from "@nestjs/common";
import {
  IFileStorage,
  UploadFile,
  UploadDocumentResult,
} from "../types/storageImages.types";
import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

@Injectable()
export class AwsStorage implements IFileStorage {
  private client: S3Client;
  private bucket: string;
  private region: string;

  constructor() {
    const AWS_REGION = process.env.AWS_REGION;
    const AWS_BUCKET = process.env.AWS_BUCKET;

    if (!AWS_REGION) {
      throw new Error("AWS_REGION not defined");
    }

    if (!AWS_BUCKET) {
      throw new Error("AWS_BUCKET not defined");
    }

    this.region = AWS_REGION;
    this.bucket = AWS_BUCKET;

    this.client = new S3Client({
      region: this.region,
      credentials:
        process.env.AWS_ACCESS_KEY_ID &&
        process.env.AWS_SECRET_ACCESS_KEY
          ? {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
          : undefined,
    });
  }

  async upload({
    fileBuffer,
    storageKey,
    mimeType,
  }: UploadFile): Promise<UploadDocumentResult> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
        Body: fileBuffer,
        ContentType: mimeType,
      });

      await this.client.send(command);
      return {
        success: true,
    
      };
    } catch (err) {
      return {
        success: false,
        error: "upload-error",
      };
    }
  }


}