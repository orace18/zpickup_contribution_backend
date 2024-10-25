import {
  IsDate, IsDateString,
  IsEmail, IsEnum,
  IsNotEmpty, IsNumberString, IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserType } from '../../Schemas/users_schema/Users.schema';
import { Zems } from '../../Schemas/zems_schema/Zems.schema';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email_address?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsNumberString()
  verification_code?: string;

  @IsOptional()
  @IsDate()
  birthday?: Date;

  @IsOptional()
  @IsString()
  sponsorship_code?: string;

  @IsOptional()
  @IsString()
  photo_piece_identity?: string;

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

  @IsDateString()
  @IsOptional()
  validated_at?: Date;
}
