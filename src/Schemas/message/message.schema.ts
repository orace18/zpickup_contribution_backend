import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Message {
  @Prop({ default: "ZPickup", required: true })
  sender: string;

  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  recipient: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
