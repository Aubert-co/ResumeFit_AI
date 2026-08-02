import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../../src/app.module';
import { User } from '../../src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import bcrypt from 'bcrypt'
let userModel = Model<User>

describe('/auth/login', () => {
    const mockUser = {
        password:"a".repeat(8),email:"lucas@gmail.com",name:'lucas'
    }
    let app: INestApplication<App>;

    beforeAll(async () => {
        
        const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
        );
            await app.init();
        userModel = moduleFixture.get<Model<User>>(getModelToken(User.name));
        await userModel.deleteMany({});
    
    });
    beforeEach(async()=>{
        await userModel.deleteMany({})
        const password =  await bcrypt.hash(mockUser.password,10)
        await userModel.create({...mockUser,password})
    })
  
    it('should log in a user successfully', async() => {
        const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send( mockUser );
        
        expect(response.status).toEqual(200)
        
        expect(response.body.data[0]).toMatchObject({
            user:Object({name:mockUser.name})
        })  
        expect(response.headers['set-cookie']).toBeDefined();
    });
    it('should return 404 when no user is registered', async() => {
        await userModel.deleteMany({})
        const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send( mockUser );
        
        expect(response.status).toEqual(404)
        expect(response.body.message).toEqual('User not found.')
    }); 
    it('should return 401 when the password is invalid', async() => {
     
        const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send( {...mockUser,password:'1'.repeat(8)} );
        
        expect(response.status).toEqual(401)
        expect(response.body.message).toEqual('Invalid email or password')
    }); 
    it('should return 500 when an unexpected database error occurs during login', async() => {
        jest.spyOn(userModel,'findOne').mockRejectedValue(new Error("error"))
        const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send( mockUser );
        
        expect(response.status).toEqual(500)
        expect(response.body.message).toEqual('Internal server error')
    }); 
});
