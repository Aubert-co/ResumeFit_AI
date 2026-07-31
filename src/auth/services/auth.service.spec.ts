import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from '../../users/repository/users.repository';
import { PinoLogger } from 'nestjs-pino';
import { JwtTokenService } from './jwt.service';
import bcrypt from 'bcrypt';
import { RegisterDTO } from '../dto/login.dto';
describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: '1',
    name: 'lucas',
    email: 'lucas@gmail.com',
    password: 'senha12345',
  };

  const mockUsersRepository = {
    getUserByEmail: jest.fn(),
    createUser: jest.fn<Promise<void>, [RegisterDTO]>(),
  };

  const mockLogger = {
    setContext: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };

  const mockJwtTokenService = {
    generateAccessToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,

        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },

        {
          provide: PinoLogger,
          useValue: mockLogger,
        },

        {
          provide: JwtTokenService,
          useValue: mockJwtTokenService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should login the user successfully', async () => {
    const hashPassword = await bcrypt.hash(mockUser.password, 10);
    mockUsersRepository.getUserByEmail.mockResolvedValue({
      ...mockUser,
      password: hashPassword,
    });
    const result = await service.userLogin({
      email: mockUser.email,
      password: mockUser.password,
    });

    expect(mockUsersRepository.getUserByEmail).toHaveBeenCalledWith(
      mockUser.email,
    );
    expect(result.user).toMatchObject({ name: mockUser.name });
    expect(result).toHaveProperty('access_token');
  });

  it('should throw an error when the password does not match', async () => {
    mockUsersRepository.getUserByEmail.mockResolvedValue({
      ...mockUser,
      password: mockUser.password,
    });
    await expect(
      service.userLogin({
        email: mockUser.email,
        password: mockUser.password,
      }),
    ).rejects.toThrow('Invalid email or password');
  });
  it('should register a user successfully', async () => {
    await service.registerUser(mockUser);

    const [createdUser] = mockUsersRepository.createUser.mock.calls[0];

    expect(createdUser).toMatchObject({
      name: mockUser.name,
      email: mockUser.email,
    });

    expect(await bcrypt.compare(mockUser.password, createdUser.password)).toBe(
      true,
    );
  });
});
