import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateConfigDto {
  @IsString()
  @IsNotEmpty()
  key: string

  @IsString()
  @IsNotEmpty()
  value: string

  @IsString()
  @IsNotEmpty()
  type: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
