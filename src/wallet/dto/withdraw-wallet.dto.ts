import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WithdrawWalletDto {
  @ApiProperty({ description: 'Montant à retirer' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Numéro de téléphone pour le retrait' })
  @IsNotEmpty()
  @IsString()
  phone_number: string;
}
