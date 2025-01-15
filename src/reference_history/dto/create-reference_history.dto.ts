import { IsMongoId, IsNumber, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateReferenceHistoryDto {
  @IsNotEmpty()
  @IsMongoId()
  referrer: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  referred: Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  bonus_amount: number;
}