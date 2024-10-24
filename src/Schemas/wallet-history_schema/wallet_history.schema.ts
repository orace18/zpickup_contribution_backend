import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Wallet } from '../wallet_schema/wallet.schema';

export enum WalletType {
  DEBIT = "Débit",
  CREDIT = "Crédit",
}

@Schema()
export class WalletHistory {
  @Prop({ type: Object, required: true })
  wallet: Wallet

  @Prop({ required: true })
  amount: number

  @Prop({ required: true, enum: WalletType })
  walletType: WalletType
}

export const WalletHistorySchema = SchemaFactory.createForClass(WalletHistory)