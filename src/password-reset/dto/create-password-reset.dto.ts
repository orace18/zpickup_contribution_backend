import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreatePasswordResetDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}