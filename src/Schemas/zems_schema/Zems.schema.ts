import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum CardType {
  IDENTITY_CARD = 'identity_card',
  CIP_CARD = 'cip_card',
  PASSPORT_CARD = 'passport_card',
}

export enum ProfileValidationStatus {
  IN_PROGRESS = 'in_progress',
  REJECTED = 'rejected',
  VALIDATED = 'validated',
}

@Schema()
export class Zems {
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

  @Prop({ default: false })
  service: boolean;

  @Prop({ required: false })
  service_latitude: number;

  @Prop({ required: false })
  service_longitude: number;

  @Prop({ type: Number, required: false })
  service_km: number;

  @Prop({ type: Number, required: false })
  service_duration: number;

  @Prop({ type: Number, required: false, default:null })
  ray: number;

  @Prop({ default: null })
  validated_at: Date;

  @Prop({ type: Types.ObjectId, ref: 'Users', required: false })
  user: Types.ObjectId;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const ZemsSchema = SchemaFactory.createForClass(Zems);
