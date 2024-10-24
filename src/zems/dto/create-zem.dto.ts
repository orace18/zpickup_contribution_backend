import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { StatusService } from '../../Schemas/zems_schema/Zems.schema';

export class CreateZemDto {
  @IsNotEmpty()
  @IsString()
  number_plate: string

  @IsNotEmpty()
  @IsString()
  plate_picture: string

  @IsEnum(StatusService)
  @IsNotEmpty()
  status_service: StatusService.UNAVAILABLE

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
