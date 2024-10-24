import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateConfigDto {
  @IsString()
  @IsNotEmpty()
  key: string

  @IsString()
  @IsNotEmpty()
  value: string

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
