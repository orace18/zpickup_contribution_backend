import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CardType, ProfileValidationStatus } from '../../Schemas/zems_schema/Zems.schema';
export class CreateZemDto {

  @IsEnum(CardType)
  @IsNotEmpty()
  card_type: CardType;

  @IsString()
  @IsNotEmpty()
  card_number: string;

  @IsString()
  @IsNotEmpty()
  card_image: string;

  @IsNotEmpty()
  @IsString()
  zem_profile_image: string;

  @IsOptional()
  @IsString()
  image_of_residence_certificate: string;

  @IsOptional()
  @IsString()
  ifu_number: string;

  @IsOptional()
  @IsString()
  ifu_number_image: string;

  @IsNotEmpty()
  @IsString()
  number_plate: string

  @IsEnum(ProfileValidationStatus)
  profile_validation_status: ProfileValidationStatus;

  @IsNotEmpty()
  @IsString()
  plate_picture: string

  @IsBoolean()
  @IsNotEmpty()
  status_service: boolean

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
