import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
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
  penaltiesNumber?: number

  @IsOptional()
  @IsString()
  penaltyReason?: string
}
