import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Wallet } from '../wallet_schema/wallet.schema';

export enum WalletType {
  DEBIT = "Debit",
  CREDIT = "Credit",
}

@Schema()
export class WalletHistory {
  @Prop({ type: Object, required: true })
  wallet: Wallet

  @Prop({ required: true })
  amount: number

  @Prop({ required: true, enum: WalletType })
  wallet_type: WalletType

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const WalletHistorySchema = SchemaFactory.createForClass(WalletHistory)