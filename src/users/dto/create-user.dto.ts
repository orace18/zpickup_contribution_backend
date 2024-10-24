import {
  IsDate, IsDateString,
  IsEmail, IsEnum,
  IsNotEmpty, IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserType } from '../../Schemas/users_schema/Users.schema';
import { Zems } from '../../Schemas/zems_schema/Zems.schema';

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

  @IsEnum(UserType)
  @IsNotEmpty()
  user_type: UserType.CUSTOMER;

  @IsOptional()
  @IsObject()
  zem: Zems

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
