import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Users } from '../users_schema/Users.schema';

@Schema()
export class Wallet {
  @Prop({ type: Object, required: true })
  user: Users

  @Prop({ required: true })
  walletAmount: number
}

export const WalletSchema = SchemaFactory.createForClass(Wallet)