import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  CardType,
  ProfileValidationStatus,
} from '../../Schemas/zems_schema/Zems.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Users } from '../../Schemas/users_schema/Users.schema';
import { Types } from 'mongoose';
export class CreateZemDto {
  @IsEnum(CardType)
  @IsNotEmpty()
  card_type: CardType;

  @IsString()
  @IsNotEmpty()
  card_number: string;

  @IsOptional()
  user: Types.ObjectId;

  @ApiProperty({ type: 'string', format: 'binary' })
  card_image: any;

  @ApiProperty({ type: 'string', format: 'binary' })
  zem_profile_image: any;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary' })
  image_of_residence_certificate: any;

  @IsOptional()
  @IsString()
  ifu_number: string;

  @IsOptional()
  @IsBoolean()
  is_ambassador:  boolean = false;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary' })
  contrat_picture: any;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary' })
  ifu_number_image: any;

  @IsNotEmpty()
  @IsString()
  number_plate: string;

  @IsEnum(ProfileValidationStatus)
  @IsOptional()
  profile_validation_status: ProfileValidationStatus;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary' })
  plate_picture: any;
}
