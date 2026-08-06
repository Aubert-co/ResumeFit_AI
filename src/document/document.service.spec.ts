import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { DocumentUpload } from './upload/documentUpload';
import { DocumentParserFactory } from './parsers/documentParser.factory';
import { DocumentRepository } from './document.repository';
import { AwsStorage } from './upload/awsStorage';
import { IFileStorage } from './types/storageImages.types';
import { Types } from 'mongoose';

describe('DocumentService', () => {
  let service:DocumentService
  const mockDocumentRepository = {
    createDocument: jest.fn(),
    deleteDocument: jest.fn(),
    countUserDocuments:jest.fn()
  };

  const mockDocumentParserFactory = {
    parser: jest.fn(),
  };

  const mockDocumentUpload = {
    uploadDocument: jest.fn(),
  };
  let mockAwsStorage={
    upload:jest.fn()
  } as IFileStorage
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,

        {
          provide: DocumentParserFactory,
          useValue: mockDocumentParserFactory,
        },

        {
          provide: AwsStorage,
          useValue: mockAwsStorage,
        },

        {
          provide: DocumentRepository,
          useValue: mockDocumentRepository,
        },
        {
          provide: DocumentUpload,
          useValue: mockDocumentUpload,
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  it("should create and upload a document successfully", async () => {
    const userId = new Types.ObjectId();

    const file = {
      buffer: Buffer.from("resume"),
      mimetype: "application/pdf",
      originalname: "resume.pdf",
    } as Express.Multer.File;

    mockDocumentRepository.countUserDocuments.mockResolvedValue(0);

    mockDocumentParserFactory.parser.mockReturnValue({
      parser: jest.fn().mockResolvedValue("resume extracted"),
    });

    mockDocumentRepository.createDocument.mockResolvedValue({
      _id: new Types.ObjectId(),
    });

    mockDocumentUpload.uploadDocument.mockResolvedValue({
      error: null,
    });

    await service.create(
      file,
      userId,
    );

    expect(
      mockDocumentRepository.countUserDocuments,
    ).toHaveBeenCalledWith(userId);

    expect(
      mockDocumentParserFactory.parser,
    ).toHaveBeenCalledWith({buffer:file.buffer,type:'pdf'});

    expect(
      mockDocumentRepository.createDocument,
    ).toHaveBeenCalled();

    expect(
      mockDocumentUpload.uploadDocument,
    ).toHaveBeenCalled();

    expect(
      mockDocumentRepository.deleteDocument,
    ).not.toHaveBeenCalled();
  });
});
