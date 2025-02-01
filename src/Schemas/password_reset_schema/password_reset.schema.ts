import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class PasswordReset {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  token: string;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const PasswordResetSchema = SchemaFactory.createForClass(PasswordReset);