import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  notif_type: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Object, default: null })
  data: object;

  @Prop({ type: Boolean, default: false })
  is_read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
