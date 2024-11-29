import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Zems } from '../zems_schema/Zems.schema';

@Schema()
export class ActivationHistory {
  @Prop({ required: true, type: Object })
  zem: Zems;

  @Prop({ required: true })
  longitude: number;

  @Prop({ required: true })
  latitude: number;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const ActivationHistorySchema = SchemaFactory.createForClass(ActivationHistory);
