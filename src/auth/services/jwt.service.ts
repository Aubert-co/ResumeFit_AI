import { Injectable } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/users/schemas/user.schema';
@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(user: UserDocument): Promise<string> {
    return this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });
  }
}
