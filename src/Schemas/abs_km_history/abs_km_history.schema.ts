import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Zems } from '../zems_schema/Zems.schema';

@Schema({ timestamps: true })
export class AbsKmHistory extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Zems', required: true })
  zem: mongoose.Types.ObjectId;

  @Prop({ required: true })
  kmAdded: number;

  @Prop({ required: true })
  type: string;

  @Prop()
  description: string;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const AbsKmHistorySchema = SchemaFactory.createForClass(AbsKmHistory);