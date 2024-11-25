import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum PaymentMethod {
  MOBILE_MONEY = 'mobile_money',
  BANK_CARD = 'bank_card',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Schema()
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Counter', required: true })
  counter: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Zems', required: true })
  zem: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: PaymentMethod })
  payment_method: PaymentMethod;

  @Prop({ required: true })
  transaction_id: string;

  @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
