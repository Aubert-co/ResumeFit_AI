export type UploadDocumentResult = {
  success: boolean
  error?: "upload-error"
}

export type UploadFile ={
  fileBuffer:Buffer,
  storageKey:string,
  mimeType:string
}


export interface IFileStorage {
  upload(data: UploadFile): Promise<UploadDocumentResult>
} 