import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsNumber()
  customer_wallet: number;

  @IsNotEmpty()
  @IsNumber()
  insurance_wallet: number;

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
