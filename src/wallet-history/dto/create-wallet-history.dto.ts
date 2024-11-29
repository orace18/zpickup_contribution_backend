import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { Wallet } from '../../Schemas/wallet_schema/wallet.schema';
import { WalletType } from '../../Schemas/wallet-history_schema/wallet_history.schema';

export class CreateWalletHistoryDto {
  @IsObject()
  @IsNotEmpty()
  wallet: Wallet

  @IsNumber()
  @IsNotEmpty()
  amount: number

  @IsEnum(WalletType)
  @IsNotEmpty()
  wallet_type: WalletType

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
