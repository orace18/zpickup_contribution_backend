import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Users } from '../users_schema/Users.schema';

@Schema()
export class Wallet {
  @Prop({ type: Object, required: true })
  user: Users

  @Prop({ required: true })
  wallet_amount: number

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet)