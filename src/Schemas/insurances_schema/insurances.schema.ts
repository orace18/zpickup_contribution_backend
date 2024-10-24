import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Customers } from '../customers_schema/customers.schema';

@Schema()
export class Insurances {
  @Prop({ type: Object })
  customer: Customers

  @Prop()
  minimumBalance: number

  @Prop({ default: false })
  activeStatus: boolean;
}

export const InsuranceSchema = SchemaFactory.createForClass(Insurances)