import { IsDateString, IsNotEmpty, IsObject } from 'class-validator';
import { Users } from '../../Schemas/users_schema/Users.schema';

export class CreateSponsorshipDto {
  @IsObject()
  @IsNotEmpty()
  user: Users

  @IsObject()
  @IsNotEmpty()
  sponsored_user: Users

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
