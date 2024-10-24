import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateZemDto {
  @IsNotEmpty()
  @IsString()
  number_plate: string

  @IsNotEmpty()
  @IsString()
  plate_picture: string

  @IsNumber()
  zem_wallet: number

  @IsNumber()
  zem_insurance_wallet: number

  @IsNumber()
  CNSS_wallet: number

  @IsNumber()
  counter_kilometer: number

  @IsBoolean()
  accept_course: boolean

  @IsBoolean()
  status: boolean

  @IsNumber()
  longitude_zem_initial: number

  @IsNumber()
  latitude_zem_initial: number

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
