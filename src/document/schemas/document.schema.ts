import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DocumentModel = HydratedDocument<Document>;
export type DocumentModelType = HydratedDocument<Document>
export enum DocumentTypeEnum {
  PDF = 'pdf',
  DOCX = 'docx',
  TXT = 'txt',
}

@Schema({
  timestamps: true,
})
export class Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId!: Types.ObjectId;

  @Prop({
    required: true,
  })
  originalName!: string;

  @Prop({
    required: true,
    enum: DocumentTypeEnum,
  })
  type!: DocumentTypeEnum;

  @Prop({
    required: true,
  })
  storageKey!: string;

  @Prop({
    required: true,
  })
  extractedText!: string;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);