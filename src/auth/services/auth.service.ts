import { Injectable, UnauthorizedException } from '@nestjs/common';

import { LoginDto, RegisterDTO } from '../dto/auth.dto';
import bcrypt from 'bcrypt';
import { PinoLogger } from 'nestjs-pino';
import { loggerFactory } from '../../commom/loggerFactory';
import { JwtTokenService } from './jwt.service';
import { UsersRepository } from '../../users/repository/users.repository';

type LoginResult = {
  access_token: string;
  user: {
    name: string;
  };
};
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly logger: PinoLogger,
    private readonly jwtService: JwtTokenService,
  ) {
    this.logger.setContext(AuthService.name);
  }
  async userLogin(dto: LoginDto): Promise<LoginResult> {
    const user = await this.userRepository.getUserByEmail(dto.email);

    const comparePassword = await bcrypt.compare(dto.password, user.password);

    if (!comparePassword) {
      this.logger.warn(
        loggerFactory({
          action: 'user login',
          method: 'userLogin',
          data: {
            user: user.name,
            email: user.email,
          },
          message: 'Invalid email or password',
        }),
      );
      throw new UnauthorizedException('Invalid email or password');
    }
    const access_token = await this.jwtService.generateAccessToken(user);

   this.logger.info(
    loggerFactory({
      action: 'user login',
      method: 'userLogin',
      data: {
        user: user.name,
        id: user.id,
      },
      message: 'User logged in successfully',
    }),
    );
    return {
      access_token,
      user: {
        name: user.name,
      },
    };
  }
  async registerUser(dto: RegisterDTO): Promise<void> {
    const hashPassword = await bcrypt.hash(dto.password, 10);

    await this.userRepository.createUser({
      email: dto.email,
      password: hashPassword,
      name: dto.name,
    });
    this.logger.info(
      loggerFactory({
        action: 'user register',
        method: 'registerUser',
        data: {
          user: dto.name,
          email: dto.email,
        },
        message: 'user created',
      }),
    );
  }
}
