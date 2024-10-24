import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Users } from '../users_schema/Users.schema';

@Schema()
export class Customers extends Users {
  @Prop({ required: true })
  customerWallet: number;

  @Prop({ required: true })
  insuranceWallet: number;
}

export const CustomersSchema = SchemaFactory.createForClass(Customers);