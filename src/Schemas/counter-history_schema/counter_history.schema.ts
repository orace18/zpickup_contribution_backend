import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Counter } from '../counter_schema/counter.schema';

export enum CounterType {
  INPUT = "Entrée",
  OUTPUT = "Sortie"
}

@Schema()
export class CounterHistory {
  @Prop({ type: Object, required: true })
  counter: Counter

  @Prop({ required: true })
  value: number

  @Prop({ required: true, enum: CounterType })
  counterType: CounterType
}

export const CounterHistorySchema = SchemaFactory.createForClass(CounterHistory)