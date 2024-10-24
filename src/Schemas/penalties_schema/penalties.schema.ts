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
  penaltiesNumber: number

  @Prop()
  penaltyReason: string
}

export const PenaltySchema = SchemaFactory.createForClass(Penalties)