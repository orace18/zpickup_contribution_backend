import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class PasswordReset {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const PasswordResetSchema = SchemaFactory.createForClass(PasswordReset);