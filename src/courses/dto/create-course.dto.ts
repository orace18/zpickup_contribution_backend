import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
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
  initialLongitude: number;

  @IsNumber()
  @IsNotEmpty()
  initialLatitude: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  initialDateTime: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateTimeCourse?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateTimeDebut?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateTimeFin?: Date;

  @IsOptional()
  @IsNumber()
  longitudeStart?: number;

  @IsOptional()
  @IsNumber()
  latitudeStart?: number;

  @IsOptional()
  @IsNumber()
  longitudeEnd?: number;

  @IsOptional()
  @IsNumber()
  latitudeEnd?: number;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsNumber()
  @IsNotEmpty()
  distanceTraveled: number;

  @IsEnum(CoursesStatus)
  @IsNotEmpty()
  status: CoursesStatus;
}
