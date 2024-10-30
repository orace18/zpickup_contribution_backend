import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Users } from '../users_schema/Users.schema';

export enum CardType {
  IDENTITY_CARD = 'identity_card',
  CIP_CARD = 'cip_card',
  PASSPORT_CARD = 'passport_card',
}

export enum ProfileValidationStatus {
  IN_PROGRESS = 'en_cours',
  REFUSED = 'refuse',
  VALID = 'valide',
}

@Schema()
export class Zems extends Users {
  @Prop({ required: true, enum: CardType, default: CardType.PASSPORT_CARD })
  card_type: CardType;

  @Prop({ required: true })
  card_number: string;

  @Prop({ required: true })
  card_image: string;

  @Prop({ required: true })
  zem_profile_image: string;

  @Prop({})
  image_of_residence_certificate: string;

  @Prop({ length: 11 })
  ifu_number: string;

  @Prop({})
  ifu_number_image: string;

  @Prop({ required: true })
  number_plate: string;

  @Prop({ required: true })
  plate_picture: string;

  @Prop({
    required: true,
    enum: ProfileValidationStatus,
    default: ProfileValidationStatus.IN_PROGRESS,
  })
  profile_validation_status: ProfileValidationStatus;

  @Prop({ required: true, default: false })
  status_service: boolean;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const ZemsSchema = SchemaFactory.createForClass(Zems)