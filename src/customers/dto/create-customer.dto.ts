import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsNumber()
  customerWallet: number;

  @IsNotEmpty()
  @IsNumber()
  insuranceWallet: number;
}
