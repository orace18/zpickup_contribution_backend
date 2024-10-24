import { IsArray, IsDateString, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Users } from '../../Schemas/users_schema/Users.schema';

export class CreateNotificationDto {
  @IsObject()
  @IsNotEmpty()
  user: Users;

  @IsString()
  message: string;

  @IsObject()
  data: Object;

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
