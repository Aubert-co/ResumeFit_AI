import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDTO } from '../../auth/dto/auth.dto';
import { isMongoError } from '../../commom/guards/error.guard';

export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async getUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      email,
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }
  async createUser(data: RegisterDTO): Promise<void> {
    try {
      await this.userModel.create(data);
    } catch (error) {
      if (isMongoError(error) && error.code === 11000) {
        throw new ConflictException('Email already exists');
      }

      throw new InternalServerErrorException(
        'An unexpected error occurred while creating the user.',
      );
    }
  }
}
