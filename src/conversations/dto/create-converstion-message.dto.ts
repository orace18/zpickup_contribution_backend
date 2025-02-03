import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';

enum FileType {
    TEXT = 'text',
    AUDIO = 'audio',
    VIDEO = 'video',
    IMAGE = 'image',
}

export class CreateConversationMessageDto {
    @IsMongoId()
    conversationId: string;

    @IsMongoId()
    senderId: string;

    @IsOptional()
    @IsString()
    text?: string;

    @IsOptional()
    @IsEnum(FileType)
    fileType?: FileType;

    @IsOptional()
    @IsString()
    fileUrl?: string;
}