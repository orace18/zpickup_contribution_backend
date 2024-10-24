import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Users } from '../users_schema/Users.schema';

@Schema()
export class Customers extends Users {
  /*@Prop({ required: true })
  customer_wallet: number;

  @Prop({ required: true })
  insurance_wallet: number;*/

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const CustomersSchema = SchemaFactory.createForClass(Customers);