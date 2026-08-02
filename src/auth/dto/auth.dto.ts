import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDTO {
  @IsString({
    message: 'Name must be a string',
  })
  @MinLength(4, {
    message: 'Name must be at least 4 characters long',
  })
  @MaxLength(15, {
    message: 'Name must not exceed 15 characters',
  })
  name!: string;

  @IsEmail({}, {
    message: 'Please provide a valid email address',
  })
  email!: string;

  @IsString({
    message: 'Password must be a string',
  })
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @MaxLength(15, {
    message: 'Password must not exceed 15 characters',
  })
  password!: string;
}

export class LoginDto {
  @IsEmail({}, {
    message: 'Please provide a valid email address',
  })
  email!: string;

  @IsString({
    message: 'Password must be a string',
  })
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @MaxLength(15, {
    message: 'Password must not exceed 15 characters',
  })
  password!: string;
}