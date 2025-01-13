import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreditWalletDto {
  @IsOptional()
  user?: Types.ObjectId;

  @IsOptional()
  @IsString()
  transaction_type: string;

  @ApiProperty({ description: 'Montant a credité' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
