import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email_address: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}