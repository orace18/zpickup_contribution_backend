import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { Users } from '../../Schemas/users_schema/Users.schema';

export class CreateWalletDto {
  @IsObject()
  @IsNotEmpty()
  user: Users

  @IsNotEmpty()
  @IsNumber()
  walletAmount: number
}
