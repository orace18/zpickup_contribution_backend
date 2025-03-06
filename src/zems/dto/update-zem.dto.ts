import { PartialType } from '@nestjs/mapped-types';
import { CreateZemDto } from './create-zem.dto';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,

} from 'class-validator';
import { ProfileValidationStatus } from '../../Schemas/zems_schema/Zems.schema';

export class UpdateZemDto extends PartialType(CreateZemDto) {
  @IsNotEmpty()
  type_action: string;

  @IsOptional()
  validated_at: Date;

  @IsEnum(ProfileValidationStatus)
  @IsOptional()
  profile_validation_status: ProfileValidationStatus;

  @IsOptional()
  service: boolean;

  @IsOptional()
  service_latitude: number;

  @IsOptional()
  service_longitude: number;
 
  @IsOptional()
  is_ambassador?: boolean;
}
