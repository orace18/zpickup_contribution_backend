import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Users } from '../users_schema/Users.schema';

@Schema()
export class Notification {
  @Prop({ required: true })
  user: Users

  @Prop({ type: [String], default: [] })
  notificationsHistory: string[]

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);