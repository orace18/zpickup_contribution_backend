import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Customers } from '../../Schemas/customers_schema/customers.schema';
import { Zems } from '../../Schemas/zems_schema/Zems.schema';
import { Type } from 'class-transformer';
import { CoursesStatus } from '../../Schemas/courses_schema/courses.schema';

export class CreateCourseDto {
  @IsObject()
  @IsNotEmpty()
  customer: Customers;

  @IsObject()
  @IsNotEmpty()
  zem: Zems;

  @IsNumber()
  @IsNotEmpty()
  initial_longitude: number;

  @IsNumber()
  @IsNotEmpty()
  initial_latitude: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  initial_datetime: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  datetime_course?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  datetime_debut?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  datetime_fin?: Date;

  @IsOptional()
  @IsNumber()
  longitude_start?: number;

  @IsOptional()
  @IsNumber()
  latitude_start?: number;

  @IsOptional()
  @IsNumber()
  longitude_end?: number;

  @IsOptional()
  @IsNumber()
  latitude_end?: number;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsNumber()
  @IsNotEmpty()
  distance_traveled: number;

  @IsEnum(CoursesStatus)
  @IsNotEmpty()
  status: CoursesStatus;

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
