import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,

} from 'class-validator';
import { PaymentMethod } from '../../Schemas/payment/payment.schema';
import { Types } from 'mongoose';

export class CreatePaymentDto {
  @IsOptional()
  user?: Types.ObjectId;

  @ApiProperty({ description: 'Amount to pay' })
  @IsNotEmpty()
  @IsNumber()
  price_per_km: number;

  @ApiProperty({ enum: PaymentMethod, description: 'Payment methode' })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;
}
