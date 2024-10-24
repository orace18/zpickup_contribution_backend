import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { Zems } from '../../Schemas/zems_schema/Zems.schema';

export class CreateCounterDto {
  @IsObject()
  @IsNotEmpty()
  zem: Zems

  @IsNotEmpty()
  @IsNumber()
  availableKilometers: number
}
