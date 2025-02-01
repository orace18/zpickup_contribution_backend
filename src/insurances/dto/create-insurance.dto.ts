import { IsBoolean, IsDateString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { Customers } from '../../Schemas/customers_schema/customers.schema';

export class CreateInsuranceDto {
  @IsObject()
  @IsNotEmpty()
  customer: Customers

  @IsOptional()
  minimum_balance?: number

  @IsBoolean()
  active_status: boolean

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
