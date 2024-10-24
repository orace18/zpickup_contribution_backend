import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export enum UserType {
  CUSTOMER = 'customer',
  ZEM = 'zem'
}

@Schema()
export class Users {
  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, unique: true })
  phone_number: string;

  @Prop({ unique: true })
  email_address: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  birthday: Date;

  @Prop()
  sponsorship_code?: string;

  @Prop({ required: true })
  photo_piece_identity: string;

  @Prop()
  profile_picture: string;

  @Prop({ required: true, enum: UserType})
  user_type: UserType.CUSTOMER;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(Users);

// Middleware pour hasher le mot de passe
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
