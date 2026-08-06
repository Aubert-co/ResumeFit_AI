import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DocumentParserFactory } from './parsers/documentParser.factory';
import { getDocumentType } from './document.helper';
import { DocumentRepository } from './document.repository';
import { DocumentTypeEnum } from './schemas/document.schema';
import { loggerFactory } from '../commom/loggerFactory';
import { DocumentUpload } from './upload/documentUpload';
import { randomUUID } from 'crypto';
import { Types } from 'mongoose';

@Injectable()
export class DocumentService {
    constructor(
        private readonly documentParser:DocumentParserFactory,
        private readonly documentRepository:DocumentRepository,
        private readonly documentUpload:DocumentUpload
    ){}
    
    async create(file:Express.Multer.File,userId:Types.ObjectId){
       
        const documentType = getDocumentType(file.mimetype)
        
        
        const storageKey = `resumes/${randomUUID()}.${documentType}`
        await this.documentRepository.countUserDocuments(userId)
        const extractedText = await this.documentParser.parser({
            buffer:file.buffer,
            type:documentType
        })

        const createdDocument = await this.documentRepository.createDocument({
            extractedText,
            type:documentType as DocumentTypeEnum,
            originalName:file.originalname,
            userId,
            storageKey
        })

        const {error} =await this.documentUpload.uploadDocument({
            fileBuffer:file.buffer,
            mimeType:file.mimetype,
            storageKey
        })
        if(error ==="upload-error"){
            await this.documentRepository.deleteDocument(createdDocument._id)
            throw new InternalServerErrorException(
                loggerFactory({
                    action: "upload_document",
                    method: "create",
                    message: "Failed to upload document",
                    errorMsg: "The document upload failed and the operation was rolled back.",
                    data: {
                    userId: userId.toString(),
                    documentId: createdDocument._id.toString(),
                    },
                }),
                );
        }
    }
}
