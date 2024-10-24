import { IsArray, IsDateString, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Users } from '../../Schemas/users_schema/Users.schema';

export class CreateNotificationDto {
  @IsObject()
  @IsNotEmpty()
  user: Users

  @IsArray()
  notificationsHistory: string[]

  @IsDateString()
  createdAt: Date
}
