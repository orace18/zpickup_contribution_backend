import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDiscussionMessageDto {
  /* @PrimaryGeneratedColumn()
    _id: number; */

  @IsString()
  @IsOptional()
  content?: string;

  @IsMongoId()
  @IsNotEmpty()
  discussionId: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @IsOptional()
  @IsString()
  mediaType?: string; // 'audio', 'video', etc.
}

export class DiscussionMessageResponseDto {
  //id: string;
  content: string;
  discussion: string;
  sender: string;
  imageUrl?: string;
  mediaUrl?: string;
  mediaType?: string;
  created_at: Date;
  updated_at: Date;
}
