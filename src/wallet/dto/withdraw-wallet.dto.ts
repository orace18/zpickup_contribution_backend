import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WithdrawStatus } from '../../Schemas/wallet_schema/withdraw-status.enum';
import { Types } from 'mongoose';

export class WithdrawWalletDto {
  @IsOptional()
  user?: Types.ObjectId;

  @ApiProperty({ description: 'Montant à retirer' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Numéro de téléphone pour le retrait' })
  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @ApiProperty({
    description: 'Statut du retrait',
    enum: WithdrawStatus,
    default: WithdrawStatus.PENDING,
  })
  @IsEnum(WithdrawStatus)
  status: WithdrawStatus = WithdrawStatus.PENDING;
}
