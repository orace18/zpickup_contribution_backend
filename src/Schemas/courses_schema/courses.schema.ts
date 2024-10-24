import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Customers } from '../customers_schema/customers.schema';
import { Zems } from '../zems_schema/Zems.schema';
import { Type } from 'class-transformer';

export enum CoursesStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'Progress',
  COMPLETED = 'completed',
  CANCELED = 'cancel'
}

@Schema()
export class Courses {
  @Prop({ type: Object })
  customer: Customers;

  @Prop({ type: Object })
  zem: Zems;

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

  @Prop({
    type: Date,
    transform: (value: Date) => value ? new Date(value) : undefined,
  })
  @Type(() => Date)
  datetime_course?: Date;

  @Prop({
    type: Date,
    transform: (value: Date) => value ? new Date(value) : undefined,
  })
  @Type(() => Date)
  datetime_debut?: Date;

  @Prop({
    type: Date,
    transform: (value: Date) => value ? new Date(value) : undefined,
  })
  @Type(() => Date)
  datetime_fin?: Date;

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
  distance_traveled: number;

  @Prop({ required: true, enum: CoursesStatus })
  status: CoursesStatus;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const CoursesSchema = SchemaFactory.createForClass(Courses);