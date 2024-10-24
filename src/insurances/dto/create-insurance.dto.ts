import { IsBoolean, IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { Customers } from '../../Schemas/customers_schema/customers.schema';

export class CreateInsuranceDto {
  @IsObject()
  @IsNotEmpty()
  customer: Customers

  @IsOptional()
  minimumBalance?: number

  @IsBoolean()
  activeStatus: boolean
}
