import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Users } from '../users_schema/Users.schema';

@Schema()
export class Sponsorship {
  @Prop({ type: Object })
  user: Users

  @Prop({ type: Object })
  sponsoredUser: Users
}

export const SponsorshipSchema = SchemaFactory.createForClass(Sponsorship)