import { IsDateString, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { Zems } from '../../Schemas/zems_schema/Zems.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCounterDto {
  @IsObject()
  @IsNotEmpty()
  zem: Zems

  @ApiProperty({ description: 'Initial balance of the counter'})
  @IsNotEmpty()
  @IsNumber()
  balance: number;

  @ApiProperty({ description: 'Price per kilometer' })
  @IsNotEmpty()
  @IsNumber()
  price_per_km: number;

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
