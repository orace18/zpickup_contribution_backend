import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Zems } from '../zems_schema/Zems.schema';

@Schema()
export class Counter {
  @Prop({ type: Object })
  zem: Zems

  @Prop({ required: true })
  available_kilometers: number

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const CounterSchema = SchemaFactory.createForClass(Counter)