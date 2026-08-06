import { Injectable } from "@nestjs/common";
import { UploadFile, UploadDocumentResult,IFileStorage } from "../types/storageImages.types";
import { AwsStorage } from "./awsStorage";

export interface IDocumentUpload{
  uploadDocument({}:UploadFile):Promise<UploadDocumentResult>
 
}
@Injectable()
export class DocumentUpload implements IDocumentUpload {
    constructor(private storage:AwsStorage){}

    public async uploadDocument({fileBuffer,storageKey,mimeType}:UploadFile):Promise<UploadDocumentResult>{
     
      return await this.storage.upload({
        fileBuffer,storageKey,mimeType
      })
    }
  
}
