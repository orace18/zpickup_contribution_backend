import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDate, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {Types} from "mongoose";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email_address?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  birthday?: string;

  @IsOptional()
  zem?:  Types.ObjectId;


}
