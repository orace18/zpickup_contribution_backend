import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Users } from '../users_schema/Users.schema';

@Schema()
export class Notification {
  @Prop({ required: true })
  user: Users

  @Prop({ type: [String], default: [] })
  notificationsHistory: string[]

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);