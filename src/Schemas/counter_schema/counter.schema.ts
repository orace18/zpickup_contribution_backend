import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Zems } from '../zems_schema/Zems.schema';

@Schema()
export class Counter {
  @Prop({ type: Object })
  zem: Zems

  @Prop({ required: true })
  availableKilometers: number
}

export const CounterSchema = SchemaFactory.createForClass(Counter)