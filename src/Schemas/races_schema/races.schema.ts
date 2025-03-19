import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import {IsOptional} from "class-validator";

export enum CoursesStatus {
  PENDING = 'pending',
  STOPPED = 'stopped',
  CANCELED = 'canceled',
  ACCEPTED = 'accepted',
  START = 'start',
  END = 'end',
}

@Schema()
export class Races {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: false })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Zems', required: false })
  zem: Types.ObjectId;

  @Prop({ required: true })
  initial_longitude: number;

  @Prop({ required: true })
  initial_latitude: number;

  @Prop({
    required: true,
    type: Date,
    transform: (value: Date) => new Date(value),
  })
  @Type(() => Date)
  initial_datetime: Date;

  @Prop()
  longitude_start?: number;

  @Prop()
  latitude_start?: number;

  @Prop()
  longitude_end?: number;

  @Prop()
  latitude_end?: number;

  @Prop({ required: true })
  reference: string;

  @Prop({ required: true })
  qrcode_start: string;

  @Prop({ required: true })
  qrcode_end: string;


  @Prop({ default: null })
  distance_traveled: number;

  @Prop({ required: true, enum: CoursesStatus })
  status: CoursesStatus;

  @Prop()
  stopped_at: Date;

  @Prop()
  pending_at: Date;

  @Prop()
  accepted_at: Date;

  @Prop()
  started_at: Date;

  @Prop()
  ended_at: Date;

  @Prop()
  service_km: number;

  @Prop()
  service_duration: number;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;

  @Prop({ default: null })
  street: string;

  @Prop({ default: null })
  country: string;

  @Prop({ default: null })
  locality: string;

  @Prop({ default: null })
  street_start: string;

  @Prop({ default: null })
  country_start: string;

  @Prop({ default: null })
  locality_start: string;


  @Prop({ default: null })
  street_end: string;

  @Prop({ default: null })
  country_end: string;

  @Prop({ default: null })
  locality_end: string;


  @Prop({ default: null })
  street_accepted: string;

  @Prop({ default: null })
  country_accepted: string;

  @Prop({ default: null })
  locality_accepted: string;

  @Prop({ default: null })
  longitude_accepted?: number;

  @Prop({ default: null })
  latitude_accepted?: number;

  @Prop({ default: null })
  zem_bonus?: number;

  @Prop({ default: null })
  customer_bonus?: number;

  @Prop({ default: null })
  admin_bonus?: number;

  @Prop({ default: null })
  zem_percent?: number;

  @Prop({ default: null })
  customer_percent?: number;

  @Prop({ default: null })
  admin_percent?: number;

  @Prop({ default: null })
  amount_per_km?: number;

  @Prop({ default: null })
  amount_total_bonus?: number;


}

export const RacesSchema = SchemaFactory.createForClass(Races);
