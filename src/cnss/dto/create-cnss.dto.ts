import { IsBoolean, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Zems } from '../../Schemas/zems_schema/Zems.schema';

export class CreateCnssDto {
  @IsObject()
  @IsNotEmpty()
  zem: Zems;

  @IsNotEmpty()
  @IsString()
  activationReason: string

  @IsBoolean()
  status: boolean
}
