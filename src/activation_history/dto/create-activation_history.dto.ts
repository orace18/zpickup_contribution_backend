import { IsDateString, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { Zems } from '../../Schemas/zems_schema/Zems.schema';

export class CreateActivationHistoryDto {
  @IsObject()
  @IsNotEmpty()
  zem: Zems

  @IsNumber()
  @IsNotEmpty()
  initial_zem_longitude: number;

  @IsNumber()
  @IsNotEmpty()
  initial_zem_latitude: number;

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
