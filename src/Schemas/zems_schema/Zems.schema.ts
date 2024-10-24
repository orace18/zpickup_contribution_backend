import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Users } from '../users_schema/Users.schema';

@Schema()
export class Zems extends Users {
  @Prop({ required: true })
  numberPlate: string;

  @Prop({ required: true })
  platePicture: string;

  @Prop()
  zemWallet: number;

  @Prop()
  ZemInsuranceWallet: number;

  @Prop()
  CNSSWallet: number;

  @Prop()
  counterKilometer: number;

  @Prop({ default: false })
  acceptCourse: boolean;

  @Prop({ default: true })
  status: boolean;

  @Prop()
  longitudeZemInitial: number;

  @Prop()
  latitudeZemInitial: number;
}

export const ZemsSchema = SchemaFactory.createForClass(Zems)