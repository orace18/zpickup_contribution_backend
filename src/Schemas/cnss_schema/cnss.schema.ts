import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Zems } from '../zems_schema/Zems.schema';

@Schema()
export class Cnss {
  @Prop({ type: Object })
  zem: Zems

  @Prop({ required: true })
  activationReason: string

  @Prop({ default: false })
  status: boolean;
}

export const CnssSchema = SchemaFactory.createForClass(Cnss)