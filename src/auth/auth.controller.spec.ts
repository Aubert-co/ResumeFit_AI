import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    registerUser: jest.fn(),
    loginUser: jest.fn(),
  };
  const userDatas = {
    email: 'lucas@gmail.com',
    name: 'lucas',
    password: '123456789',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });
  it('should register user', async () => {
    authServiceMock.registerUser.mockResolvedValue({
      message: 'User created successfully',
    });

    const result = await controller.register(userDatas);

    expect(result).toEqual({
      message: 'User created successfully',
    });

    expect(authServiceMock.registerUser).toHaveBeenCalledWith({
      email: userDatas.email,
      name: userDatas.name,
      password: userDatas.password,
    });
  });
});
