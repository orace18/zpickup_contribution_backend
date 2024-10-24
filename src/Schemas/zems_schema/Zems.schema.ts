import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Users } from '../users_schema/Users.schema';

@Schema()
export class Zems extends Users {
  @Prop({ required: true })
  number_plate: string;

  @Prop({ required: true })
  plate_picture: string;

  @Prop({ required: true, default: false })
  status_service: boolean;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const ZemsSchema = SchemaFactory.createForClass(Zems)