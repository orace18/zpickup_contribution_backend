import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Customers } from '../customers_schema/customers.schema';
import { Zems } from '../zems_schema/Zems.schema';
import { Type } from 'class-transformer';

export enum CoursesStatus {
  PENDING = 'En attente',
  IN_PROGRESS = 'En cours',
  COMPLETED = 'Terminé',
  CANCELED = 'Annulé'
}

@Schema()
export class Courses {
  @Prop({ type: Object })
  customer: Customers;

  @Prop({ type: Object })
  zem: Zems;

  @Prop({ required: true })
  initialLongitude: number;

  @Prop({ required: true })
  initialLatitude: number;

  @Prop({
    required: true,
    type: Date,
    transform: (value: Date) => new Date(value),
  })
  @Type(() => Date)
  initialDateTime: Date;

  @Prop({
    type: Date,
    transform: (value: Date) => value ? new Date(value) : undefined,
  })
  @Type(() => Date)
  dateTimeCourse?: Date;

  @Prop({
    type: Date,
    transform: (value: Date) => value ? new Date(value) : undefined,
  })
  @Type(() => Date)
  dateTimeDebut?: Date;

  @Prop({
    type: Date,
    transform: (value: Date) => value ? new Date(value) : undefined,
  })
  @Type(() => Date)
  dateTimeFin?: Date;

  @Prop()
  longitudeStart?: number;

  @Prop()
  latitudeStart?: number;

  @Prop()
  longitudeEnd?: number;

  @Prop()
  latitudeEnd?: number;

  @Prop({ required: true })
  reference: string;

  @Prop({ required: true })
  distanceTraveled: number;

  @Prop({ required: true, enum: CoursesStatus })
  status: CoursesStatus;
}

export const CoursesSchema = SchemaFactory.createForClass(Courses);