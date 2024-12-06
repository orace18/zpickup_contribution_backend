import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Zems } from '../zems_schema/Zems.schema';

@Schema()
export class Counter {
  @Prop({ type: Object })
  zem: Zems

  @Prop({ required: true, default: 0 })
  balance_km: number

  @Prop({ required: true })
  price_per_km: number;

  @Prop({ default: false })
  is_low_balance: boolean;

  @Prop({ default: 0 })
  total_km_traveled: number;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const CounterSchema = SchemaFactory.createForClass(Counter)