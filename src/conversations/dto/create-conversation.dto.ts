import { IsMongoId } from 'class-validator';

export class CreateConversationDto {
  @IsMongoId()
  userId: string;

  @IsMongoId()
  adminId: string;
}