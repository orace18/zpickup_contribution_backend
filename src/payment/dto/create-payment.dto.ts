import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PaymentMethod } from '../../Schemas/payment/payment.schema';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Amount to pay' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: PaymentMethod, description: 'Payment methode' })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;
}
