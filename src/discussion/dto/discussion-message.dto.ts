import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateDiscussionMessageDto {
    @IsString()
    @IsNotEmpty()
    content: string;
  
    @IsMongoId()
    @IsNotEmpty()
    discussionId: string;
}

export class DiscussionMessageResponseDto {
    id: string;
    content: string;
    discussion: string;
    sender: string;
    created_at: Date;
    updated_at: Date;
}