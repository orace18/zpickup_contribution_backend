import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class GSMNumberFormat extends Document {
  @Prop({ required: true, unique: true })
  prefix: string;

  @Prop({ required: true })
  operator_name: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const GSMNumberFormatSchema = SchemaFactory.createForClass(GSMNumberFormat);