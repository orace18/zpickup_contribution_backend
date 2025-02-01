import { IsBoolean, IsDateString, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Zems } from '../../Schemas/zems_schema/Zems.schema';

export class CreateCnssDto {
  @IsObject()
  @IsNotEmpty()
  zem: Zems;

  @IsBoolean()
  status: boolean

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
