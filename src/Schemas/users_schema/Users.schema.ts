import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { PrimaryGeneratedColumn } from 'typeorm/typeorm-model-shim.js';


export enum UserType {
  CUSTOMER = 'customer',
  ZEM = 'zem'
}

@Schema()
export class Users {
  @PrimaryGeneratedColumn()
  _id: number;

  @Prop()
  lastname?: string;

  @Prop()
  firstname?: string;

  @Prop()
  address?: string;

  @Prop({ required: true, unique: true })
  phone_number: string;

  @Prop({ })
  email_address?: string;

  @Prop({ default: null })
  password?: string;

  @Prop()
  verification_code: string;

  @Prop({ default: null })
  birthday?: string;

  @Prop()
  sponsorship_code?: string;

  @Prop()
  photo_piece_identity?: string;

  @Prop()
  profile_picture?: string;

  @Prop({ required: true, enum: UserType})
  user_type: UserType.CUSTOMER;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;

  @Prop({ default: null })
  validated_at?: Date;

  @Prop({ default: 0 })
  token_version: number;
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
