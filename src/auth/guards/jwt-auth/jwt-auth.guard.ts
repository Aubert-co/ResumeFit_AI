import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { loggerFactory } from 'src/commom/loggerFactory';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = User>(err: any, user: any): TUser {
    
    if(err || !user){
      throw new UnauthorizedException('sem autorização')
    }

    return user
  }
}

