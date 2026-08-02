import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './services/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './schemas/user.schema';
import { UsersRepository } from './repository/users.repository';
@Module({
  imports:[
     MongooseModule.forFeature([
          {
            schema: UserSchema,
            name: User.name,
          },
        ]),
  ],
  controllers: [UsersController],
  providers: [UsersService,UsersRepository],
  exports:[
    UsersService,
    UsersRepository
  ]
})
export class UsersModule {}
