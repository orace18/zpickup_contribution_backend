import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Zems } from '../zems_schema/Zems.schema';

@Schema()
export class Cnss {
  @Prop({ type: Object })
  zem: Zems

  @Prop({ required: true })
  activation_reason: string

  @Prop({ default: false })
  status: boolean;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const CnssSchema = SchemaFactory.createForClass(Cnss)