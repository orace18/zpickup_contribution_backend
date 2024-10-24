import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Users } from '../users_schema/Users.schema';

@Schema()
export class Zems extends Users {
  @Prop({ required: true })
  number_plate: string;

  @Prop({ required: true })
  plate_picture: string;

  @Prop()
  zem_wallet: number;

  @Prop()
  zem_insurance_wallet: number;

  @Prop()
  CNSS_wallet: number;

  @Prop()
  counter_kilometer: number;

  @Prop({ default: false })
  accept_course: boolean;

  @Prop({ default: true })
  status: boolean;

  @Prop()
  longitude_zem_initial: number;

  @Prop()
  latitude_zem_initial: number;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const ZemsSchema = SchemaFactory.createForClass(Zems)