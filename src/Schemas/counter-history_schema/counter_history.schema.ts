import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Counter } from '../counter_schema/counter.schema';
import {Types} from "mongoose";

export enum CounterType {
  INPUT = "input",
  OUTPUT = "output"
}

@Schema()
export class CounterHistory {

  @Prop({ type: Types.ObjectId, ref: 'Counter', required: true })
  counter: Types.ObjectId;

  @Prop({ required: true })
  value: number

  @Prop({ required: true, enum: CounterType })
  counter_type: CounterType

  @Prop({ required: true})
  reference: String

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const CounterHistorySchema = SchemaFactory.createForClass(CounterHistory)
