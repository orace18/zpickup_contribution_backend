import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateZemDto {
  @IsNotEmpty()
  @IsString()
  numberPlate: string

  @IsNotEmpty()
  @IsString()
  platePicture: string

  @IsNumber()
  zemWallet: number

  @IsNumber()
  ZemInsuranceWallet: number

  @IsNumber()
  CNSSWallet: number

  @IsNumber()
  counterKilometer: number

  @IsBoolean()
  acceptCourse: boolean

  @IsBoolean()
  status: boolean

  @IsNumber()
  longitudeZemInitial: number

  @IsNumber()
  latitudeZemInitial: number
}
