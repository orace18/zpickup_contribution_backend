import { IsMongoId, IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateDiscussionZemClientMessageDto {
    @IsMongoId()
    @IsNotEmpty()
    discussionId: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsString()
    @IsOptional()
    mediaUrl?: string;

    @IsString()
    @IsOptional()
    mediaType?: string;
}