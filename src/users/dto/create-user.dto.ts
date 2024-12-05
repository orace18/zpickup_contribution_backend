import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserType } from '../../Schemas/users_schema/Users.schema';
import { Types } from 'mongoose';

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
  @IsString()
  birthday?: string;

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
  user_type: UserType;

  @IsOptional()
  zem: Types.ObjectId;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;

  @IsDate()
  @IsOptional()
  validated_at?: Date;

  @IsOptional()
  token_version?: number;
}
