import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../../src/app.module';
import { User, UserSchema } from '../../src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import bcrypt from 'bcrypt'
let userModel = Model<User>

describe('/auth/register', () => {
  const mockUser = {
    name:"lucas",password:"a".repeat(8),email:"lucas@gmail.com"
  }
  let app: INestApplication<App>;

  beforeEach(async () => {
    
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

  it('should create a new user successfully', async() => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send( mockUser )
      expect(response.status).toEqual(201)
      const user = await userModel.find({email:mockUser.email})
      expect(user).toHaveLength(1)
      expect(user[0].name).toEqual(mockUser.name)
      expect(await bcrypt.compare(mockUser.password,user[0].password)).toBeTruthy()
  });
  it('should return 409 when the email already exists and should not create a duplicate user',async()=>{
    await userModel.create(mockUser)
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send( mockUser )
      expect(response.status).toEqual(409)
      expect(response.body.message).toEqual('Email already exists')
      const user = await userModel.find({email:mockUser.email})
      expect(user).toHaveLength(1)
  })
  it('should return 500 when an unexpected database error occurs during user registration', async() => {
    jest.spyOn(userModel,'create').mockRejectedValue(new Error("error"))
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send( mockUser )
      expect(response.status).toEqual(500)
      expect(response.body).toMatchObject({message:'An unexpected error occurred while creating the user.'})
  });
  it('should return 400 when the name, email, or password is missing', async() => {

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send( {password:'1'} )

    expect(response.status).toEqual(400)
   
  });
});
