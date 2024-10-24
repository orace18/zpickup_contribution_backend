import { IsDateString, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Zems } from '../../Schemas/zems_schema/Zems.schema';
import { Courses } from '../../Schemas/courses_schema/courses.schema';

export class CreatePenaltyDto {
  @IsObject()
  @IsNotEmpty()
  zem: Zems

  @IsObject()
  @IsNotEmpty()
  course: Courses

  @IsOptional()
  @IsNumber()
  penalties_number?: number

  @IsOptional()
  @IsString()
  penalty_reason?: string

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
