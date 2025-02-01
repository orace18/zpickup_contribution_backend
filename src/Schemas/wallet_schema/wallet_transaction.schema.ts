import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Races } from '../races_schema/races.schema';

export enum TransactionType {
  BONUS = 'bonus',
  WITHDRAWAL = 'withdrawal',
  DEBIT = 'debit',
}

@Schema()
export class WalletTransaction {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: TransactionType })
  type: TransactionType;

  @Prop({ type: Types.ObjectId, ref: 'Races', required: false })
  race?: Races;

  @Prop({ required: false })
  phone_number?: string;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const WalletTransactionSchema =
  SchemaFactory.createForClass(WalletTransaction);
