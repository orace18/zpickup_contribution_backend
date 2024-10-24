import { IsDateString, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { Zems } from '../../Schemas/zems_schema/Zems.schema';

export class CreateCounterDto {
  @IsObject()
  @IsNotEmpty()
  zem: Zems

  @IsNotEmpty()
  @IsNumber()
  available_kilometers: number

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
