import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Users } from '../users_schema/Users.schema';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  user: Users;

  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  admin: Users;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isResolved: boolean;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);