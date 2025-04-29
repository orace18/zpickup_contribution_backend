import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class VerificationCode extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true, default: false })
  used: boolean;

  @Prop({ type: Date, default: Date.now, expires: 3600 }) // Expire après 1 heure
  createdAt: Date;
}

export const VerificationCodeSchema = SchemaFactory.createForClass(VerificationCode);