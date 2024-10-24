import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Counter } from '../counter_schema/counter.schema';

export enum CounterType {
  INPUT = "Input",
  OUTPUT = "Output"
}

@Schema()
export class CounterHistory {
  @Prop({ type: Object, required: true })
  counter: Counter

  @Prop({ required: true })
  value: number

  @Prop({ required: true, enum: CounterType })
  counter_type: CounterType

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const CounterHistorySchema = SchemaFactory.createForClass(CounterHistory)