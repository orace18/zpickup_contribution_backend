import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateZemDto {
  @IsNotEmpty()
  @IsString()
  number_plate: string

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
