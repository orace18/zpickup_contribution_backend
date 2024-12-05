import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WithdrawWalletDto {
  @ApiProperty({ description: 'Montant à retirer' })
  @IsNotEmpty()
  @IsNumber()
  @Min(10000)
  amount: number;

  @ApiProperty({ description: 'Numéro de téléphone pour le retrait' })
  @IsNotEmpty()
  @IsString()
  phone_number: string;
}
