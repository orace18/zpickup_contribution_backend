import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Races } from '../races_schema/races.schema';
import { WithdrawStatus } from './withdraw-status.enum';

export enum TransactionType {
  BONUS = 'bonus',
  BONUS_LIMIT_CUSTOMER_RACES = 'Bonus 50 courses client',
  CREDIT_AMBASSADOR = 'Recharge',
  BONUS_LIMIT_ZEM_RACES = 'Bonus 50 courses transporteur',
  BONUS_AMBASSADOR_CLIENT = "Bonus d'affiliation Client",
  BONUS_AMBASSADOR_ZEM = "Bonus d'affiliation Zem",
  WITHDRAWAL = 'withdrawal',
  DEBIT = 'debit',
}

@Schema()
export class WalletTransaction {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Users', required: false })
  referred: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: TransactionType })
  type: TransactionType;

  @Prop({ required: true, enum: ['user', 'ambassador'], default: 'user' }) // Ajout du type de portefeuille
  wallet_type: string;

  @Prop({ type: Types.ObjectId, ref: 'Races', required: false })
  race?: Races;

  @Prop({ required: false })
  phone_number?: string;

  @Prop({ default: WithdrawStatus.ACCEPTED })
  status: WithdrawStatus;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const WalletTransactionSchema =
  SchemaFactory.createForClass(WalletTransaction);
