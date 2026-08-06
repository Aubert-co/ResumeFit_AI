import { Injectable } from '@nestjs/common';
import  { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types/JwtPayload.types';
@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(user: JwtPayload): Promise<string> {
    return this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });
  }
}
