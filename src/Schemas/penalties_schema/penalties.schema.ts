import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Zems } from '../zems_schema/Zems.schema';
import { Courses } from '../courses_schema/courses.schema';

@Schema()
export class Penalties {
  @Prop({ type: Object })
  zem: Zems

  @Prop({ type: Object })
  course: Courses

  @Prop()
  penalties_number: number

  @Prop()
  penalty_reason: string

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const PenaltySchema = SchemaFactory.createForClass(Penalties)