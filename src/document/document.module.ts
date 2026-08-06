import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentDOCX } from './parsers/documentDocx';
import { DocumentPDF } from './parsers/documentPdf';
import { DocumentParserFactory } from './parsers/documentParser.factory';
import { DocumentTXT } from './parsers/documentTXT';
import { MongooseModule } from '@nestjs/mongoose';
import { Document, DocumentSchema } from './schemas/document.schema';
import { DocumentController } from './controller/document.controller';
import { AuthModule } from '../auth/auth.module';
import { DocumentUpload } from './upload/documentUpload';
import { AwsStorage } from './upload/awsStorage';
import { DocumentRepository } from './document.repository';

@Module({
  imports:[
    MongooseModule.forFeature([{
      schema:DocumentSchema,
      name:Document.name
    }]),
    AuthModule
  ],
  providers: [
    DocumentService,
    DocumentDOCX,
    DocumentPDF,
    DocumentParserFactory,
    DocumentTXT,
    DocumentUpload,
    AwsStorage,
    DocumentRepository
  ],
  exports:[
    DocumentParserFactory
  ],
  controllers:[
    DocumentController
  ]
})
export class DocumentModule {}
