import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../../src/app.module';
import { User } from '../../src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import bcrypt from 'bcrypt'
import { DocumentUpload } from '../../src/document/upload/documentUpload';
import { Document } from '../../src/document/schemas/document.schema';
import cookieParser from 'cookie-parser';
import path from 'path';
let userModel: Model<User>;
let documentModel: Model<Document>;
describe('/documents', () => {
    const mockUser = {
        password:"a".repeat(8),email:"lucas@gmail.com",name:'lucas',
        id:'0'
    }
    let app: INestApplication<App>;
    const mockDocumentUpload = {
        uploadDocument: jest.fn().mockResolvedValue({
            error: null,
        }),
    };
    beforeAll(async () => {
        
        const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
        })
        .overrideProvider(DocumentUpload)
        .useValue(mockDocumentUpload)
        .compile()  
        
 
        app = moduleFixture.createNestApplication()
        app.use(cookieParser())
        app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
        );
        await app.init();
        userModel = moduleFixture.get<Model<User>>(getModelToken(User.name));
        documentModel = moduleFixture.get<Model<Document>>(getModelToken(Document.name))
        await userModel.deleteMany({});
       
        const password =  await bcrypt.hash(mockUser.password,10)
        const user = await userModel.create({...mockUser,password})
        mockUser.id =user.id
        await documentModel.deleteMany({})
    });
  
    beforeEach(async()=>{
        await documentModel.deleteMany({})
    })
    it.skip("should create a pdf resume successfully", async () => {
        const documentData = {
            originalName: "resumes.pdf",
            type: "pdf",
        };

        const agent = request.agent(app.getHttpServer());

        const login = await agent
            .post("/auth/login")
            .send(mockUser)
            .expect(200);

        expect(login.headers["set-cookie"]).toBeDefined();

        const response = await agent
            .post("/documents")
            .attach(
            "file",
            path.join(__dirname, "../files/resumes.pdf"),
            );

        expect(response.status).toBe(201);

        const documents = await documentModel.find({
            userId: mockUser.id,
        });

        expect(documents).toHaveLength(1);

        const savedDocument = documents[0];

        expect(savedDocument.storageKey.startsWith("resumes/")).toBe(true);
        expect(savedDocument.storageKey.endsWith(".pdf")).toBe(true);

        expect(savedDocument.type).toBe(documentData.type);
        expect(savedDocument.originalName).toBe(documentData.originalName);

        expect(savedDocument.extractedText.length).toEqual("testint pdf lorem iptsu")

    });
    it('should not create a resume when file type is invalid', async () => {
        const invalidFile = {
            originalName: "resume.exe",
            extractedText: "malicious content",
        };

        const agent = request.agent(app.getHttpServer());

        const login = await agent
            .post("/auth/login")
            .send(mockUser)
            .expect(200);

        expect(login.headers['set-cookie']).toBeDefined();

        const response = await agent
            .post("/documents")
            .attach("file", Buffer.from(invalidFile.extractedText), invalidFile.originalName);

        expect(response.status).toBe(400);

        const documents = await documentModel.find({
            userId: mockUser.id,
        });

        expect(documents).toHaveLength(0);
    });
    it('should create a txt resume successfully', async() => {
        const documentData = {
            originalName:"resume.txt",
            extratedText:"lorem ipstu",
            type:'txt'
        }
        const agent = request.agent(app.getHttpServer());

        const login = await agent
        .post("/auth/login")
        .send(mockUser)
        .expect(200);

        expect(login.headers['set-cookie']).toBeDefined();
        const response = await agent
        .post("/documents")
        .attach("file", Buffer.from(documentData.extratedText), documentData.originalName);

        
        expect(response.status).toBe(201); 

        const document = await documentModel.find({
            userId:mockUser.id
        })
        const storageKey = document[0].storageKey;

        expect(storageKey.startsWith("resumes/")).toBe(true);
        expect(storageKey.endsWith(documentData.type)).toBe(true);
        expect(document).toHaveLength(1)
        expect(document[0].type).toEqual(documentData.type)
        expect(document[0].originalName).toEqual(documentData.originalName)
        expect(document[0].extractedText).toEqual(documentData.extratedText)
    });
   it("should create a docx resume successfully", async () => {
    const documentData = {
        originalName: "resumes.docx",
        type: "docx",
        extratedText:"testingnghgg"
    };

    const agent = request.agent(app.getHttpServer());

    const login = await agent
        .post("/auth/login")
        .send(mockUser)
        .expect(200);

    expect(login.headers["set-cookie"]).toBeDefined();

    const response = await agent
        .post("/documents")
        .attach(
        "file",
        path.join(__dirname, "../files/resumes.docx")
        );

    expect(response.status).toBe(201);

    const documents = await documentModel.find({
        userId: mockUser.id,
    });

    expect(documents).toHaveLength(1);

    const savedDocument = documents[0];

    expect(savedDocument.storageKey.startsWith("resumes/")).toBe(true);
    expect(savedDocument.storageKey.endsWith(".docx")).toBe(true);

    expect(savedDocument.type).toBe(documentData.type);
    expect(savedDocument.originalName).toBe(documentData.originalName);

    expect(savedDocument.extractedText).toEqual(documentData.extratedText)
    });
});
