import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { PrimaryGeneratedColumn } from 'typeorm/typeorm-model-shim.js';

export enum UserType {
  CUSTOMER = 'customer',
  ZEM = 'zem',
  ADMIN = 'admin'
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
  user_profile_image?: string;

  @Prop()
  address?: string;

  @Prop({ required: true, unique: true })
  phone_number: string;

  @Prop({})
  email_address?: string;

  @Prop({ default: null })
  referal_code?: string;
  
  @Prop({ default: null })
  password?: string;

  @Prop({ type: String })
  verification_code: string;

  @Prop({ default: null })
  birthday?: string;

  @Prop({ default: null })
  sponsorship_code?: string;

  @Prop()
  photo_piece_identity?: string;

  @Prop()
  profile_picture?: string;

  @Prop({ required: true, enum: UserType, default: UserType.CUSTOMER })
  user_type: UserType;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;

  @Prop({ default: null })
  validated_at?: Date;

  @Prop({ default: null })
  deleted_at?: Date;

  @Prop({ default: 0 })
  token_version: number;

  @Prop({ type: Types.ObjectId, ref: 'Zems', required: false })
  zem: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Races', required: false })
  race: Types.ObjectId;

  @Prop()
  fcm_token: string;

  @Prop()
  code_pin: string;

  @Prop({ type: Types.ObjectId, ref: 'Role' })
  role: Types.ObjectId;

}

export const UserSchema = SchemaFactory.createForClass(Users);

// Middleware pour hasher le mot de passe
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
 /*    console.log('Hachage du mot de passe dans le middleware pre-save');
    console.log('Mot de passe avant hachage:', this.password); */
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
   /*  console.log('Mot de passe après hachage:', this.password); */
    next();
  } catch (error) {
    next(error);
  }
});

// Supprimer l'ancien index unique sur phone_number s'il existe
UserSchema.index({ phone_number: 1 }, { unique: false });

// Créer un nouvel index composé
UserSchema.index(
  { 
    phone_number: 1,
    validated_at: 1,
    deleted_at: 1
  },
  { 
    unique: true,
    partialFilterExpression: { 
      validated_at: { $ne: null },
      deleted_at: null
    }
  }
);
