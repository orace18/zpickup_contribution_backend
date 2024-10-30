import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CardType, ProfileValidationStatus } from '../../Schemas/zems_schema/Zems.schema';
import {ApiProperty} from "@nestjs/swagger";
export class CreateZemDto {

  @IsEnum(CardType)
  @IsNotEmpty()
  card_type: CardType;

  @IsString()
  @IsNotEmpty()
  card_number: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  card_image: any;

  @ApiProperty({ type: 'string', format: 'binary' })
  zem_profile_image: string;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary' })
  image_of_residence_certificate: string;

  @IsOptional()
  @IsString()
  ifu_number: string;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary' })
  ifu_number_image: string;

  @IsNotEmpty()
  @IsString()
  number_plate: string

  @IsEnum(ProfileValidationStatus)
  @IsOptional()
  profile_validation_status: ProfileValidationStatus;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary' })
  plate_picture: string

}
