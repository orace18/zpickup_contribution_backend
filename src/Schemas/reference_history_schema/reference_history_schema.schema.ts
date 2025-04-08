import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class ReferenceHistory {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  referrer: Types.ObjectId; // Le parrain

  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  referred: Types.ObjectId; // Le filleul

  @Prop({ required: true })
  bonus_amount: number;

  @Prop({ default: false })
  is_ambassador_referral: boolean;

  @Prop({ type: Boolean, default: false })
  zem_validation_bonus_paid: boolean;

  @Prop({ type: Number })
  zem_validation_bonus_amount: number;

  @Prop({ type: Date })
  zem_validation_bonus_paid_at: Date;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const ReferenceHistorySchema =
  SchemaFactory.createForClass(ReferenceHistory);
