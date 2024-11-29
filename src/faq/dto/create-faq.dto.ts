import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsString()
  @IsNotEmpty()
  youtube_video_link: string

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
