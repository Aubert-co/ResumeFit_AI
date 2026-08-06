import { Document, DocumentModelType, DocumentTypeEnum } from "./schemas/document.schema";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { DocumentType } from "./types/document.types";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { loggerFactory } from "../../src/commom/loggerFactory";

type CreateDocument = {
    storageKey:string,
    userId:Types.ObjectId,
    extractedText:string,
    type:DocumentTypeEnum,
    originalName:string
}
@Injectable()
export class DocumentRepository{
    constructor(    
        @InjectModel(Document.name)
        private readonly documentModel:Model<Document>){}
    
    async createDocument(data:CreateDocument):Promise<DocumentModelType>{
       return await this.documentModel.create(data)
    }
    async findDocuments(userId:Types.ObjectId){
        await this.documentModel.find({
            userId
        })
    }
    async countUserDocuments(userId:Types.ObjectId):Promise<void>{
        const countValue  = await this.documentModel.countDocuments({
            userId
        })
        if (countValue >= 5) {
            throw new BadRequestException(
                loggerFactory({
                action: 'upload_document',
                method: 'create',
                message: 'Maximum number of resumes reached',
                errorMsg: 'You can upload up to 5 resumes.',
                data: {
                    userId: userId.toString(),
                },
                }),
            );
        }
    }
    async deleteDocument(documentId:Types.ObjectId):Promise<void>{
        await this.documentModel.deleteOne({
            _id:documentId
        })
    }
}