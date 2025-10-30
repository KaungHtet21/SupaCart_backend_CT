import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterInput {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class LoginInput {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
