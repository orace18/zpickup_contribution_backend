import { IsMongoId, IsNumber, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateReferenceHistoryDto {
  @IsNotEmpty()
  @IsMongoId()
  referrer: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  referred: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  referal_code: string;

  @IsNotEmpty()
  @IsNumber()
  bonus_amount: number;
}
