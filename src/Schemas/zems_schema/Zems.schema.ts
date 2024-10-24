import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Users } from '../users_schema/Users.schema';

export enum StatusService {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
}

@Schema()
export class Zems extends Users {
  @Prop({ required: true })
  number_plate: string;

  @Prop({ required: true })
  plate_picture: string;

  @Prop({ required: true, enum: StatusService })
  status_service: StatusService.UNAVAILABLE;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const ZemsSchema = SchemaFactory.createForClass(Zems)