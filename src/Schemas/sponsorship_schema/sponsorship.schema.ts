import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Users } from '../users_schema/Users.schema';

@Schema()
export class Sponsorship {
  @Prop({ type: Object })
  user: Users

  @Prop({ type: Object })
  sponsored_user: Users

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const SponsorshipSchema = SchemaFactory.createForClass(Sponsorship)