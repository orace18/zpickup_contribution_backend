import {
  IsDate, IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email_address?: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsDate()
  birthday: Date;

  @IsOptional()
  @IsString()
  sponsorship_code?: string;

  @IsNotEmpty()
  @IsString()
  photo_piece_identity: string;

  @IsOptional()
  @IsString()
  profile_picture?: string;

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
