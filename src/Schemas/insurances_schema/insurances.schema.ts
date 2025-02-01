import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Customers } from '../customers_schema/customers.schema';

@Schema()
export class Insurances {
  @Prop({ type: Object })
  customer: Customers

  @Prop()
  minimum_balance: number

  @Prop({ default: false })
  active_status: boolean;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const InsuranceSchema = SchemaFactory.createForClass(Insurances)