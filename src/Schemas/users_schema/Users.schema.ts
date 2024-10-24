import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UsersDocument = HydratedDocument<Users>;

@Schema()
export class Users {
  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ unique: true })
  emailAddress: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  birthday: Date;

  @Prop()
  sponsorshipCode: string;

  @Prop({ required: true })
  photoPieceIdentity: string;

  @Prop()
  profilePicture: string;
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
