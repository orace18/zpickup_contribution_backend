import { IsDateString, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { Zems } from '../../Schemas/zems_schema/Zems.schema';

export class CreateActivationHistoryDto {
  @IsObject()
  @IsNotEmpty()
  zem: Zems

  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
