import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDiscussionMessageDto {
    @IsString()
    @IsOptional()
    content: string;
  
    @IsMongoId()
    @IsNotEmpty()
    discussionId: string;

    @IsOptional()
    @IsString()
    mediaUrl?: string;

    @IsOptional()
    @IsString()
    mediaType?: string;
}

export class DiscussionMessageResponseDto {
    id: string;
    content: string;
    discussion: string;
    sender: string;
    mediaUrl?: string;
    mediaType?: string;
    created_at: Date;
    updated_at: Date;
}