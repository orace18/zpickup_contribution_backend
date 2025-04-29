import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFaqDto {
  
  @IsOptional()
  @IsString() 
  key?: string;

  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsString()
  @IsOptional()
  youtube_video_link: string
}
