import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreditWalletDto {
  @IsNotEmpty()
  @IsString()
  transaction_type: string;

  @ApiProperty({ description: 'Montant a credité' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
