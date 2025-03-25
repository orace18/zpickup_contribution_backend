import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDiscussionMessageDto {
    @IsString()
    @IsNotEmpty()
    content?: string;
  
    @IsMongoId()
    @IsNotEmpty()
    discussionId: string;

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
    created_at: Date;
    updated_at: Date;
}