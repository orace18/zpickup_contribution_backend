import { IsNotEmpty, IsObject } from 'class-validator';
import { Users } from '../../Schemas/users_schema/Users.schema';

export class CreateSponsorshipDto {
  @IsObject()
  @IsNotEmpty()
  user: Users

  @IsObject()
  @IsNotEmpty()
  sponsoredUser: Users
}
