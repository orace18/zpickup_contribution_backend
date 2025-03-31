import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDiscussionMessageDto {
    @IsString()
    @IsOptional()
    content?: string;
  
    @IsMongoId()
    @IsNotEmpty()
    discussionId: string;

    @IsOptional()
    @IsString()
    mediaUrl?: string;

    @IsOptional()
    @IsString()
    mediaType?: string;

    @IsString()
    @IsOptional()
    imageUrl?: string;
}

export class DiscussionMessageResponseDto {
    id: string;
    content: string;
    discussion: string;
    sender: string;
    imageUrl?: string;
    mediaUrl?: string;
    mediaType?: string;
    created_at: Date;
    updated_at: Date;
}