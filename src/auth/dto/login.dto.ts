import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDTO {
  @IsString()
  @MaxLength(15)
  @MinLength(4)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MaxLength(15)
  @MinLength(8)
  password!: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MaxLength(15)
  @MinLength(8)
  password!: string;
}
