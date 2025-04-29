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

@Schema({ timestamps: true })
export class Zems {
  @Prop({ enum: CardType, default: CardType.PASSPORT_CARD })
  card_type: CardType;

  @Prop({ default: null })
  card_number: string;

  @Prop({ default: null })
  card_image: string;

  @Prop({ default: null })
  zem_profile_image: string;

  @Prop({ default: null })
  image_of_residence_certificate: string;

  @Prop({ default: null, length: 11 })
  ifu_number: string;

  @Prop({ default: null })
  ifu_number_image: string;

  @Prop({ default: null })
  number_plate: string;

  @Prop({ default: null })
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

  @Prop({ type: Number, required: false, default: null })
  ray: number;

  @Prop({ default: null })
  validated_at?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Users', required: false })
  user: Types.ObjectId;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;

  @Prop({ type: Boolean, default: false })
  is_ambassador: boolean;

  @Prop()
  contrat_document: string;

  @Prop({ default: null })
  temporal_validated_at: Date;

  @Prop({ default: false })
  is_temporal: boolean;

  @Prop({ default: new Date() })
  expired_at: Date;

  @Prop({ default: null })
  zem_races_count?: string;
}

export const ZemsSchema = SchemaFactory.createForClass(Zems);
