import { IsDateString, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { Users } from '../../Schemas/users_schema/Users.schema';

export class CreateWalletDto {
  @IsObject()
  @IsNotEmpty()
  user: Users;

  @IsNotEmpty()
  @IsNumber()
  wallet_amount: number;

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
