import { IsMongoId, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CreatorsDto {
    @IsMongoId()
    @IsNotEmpty()
    zem: Types.ObjectId;

    @IsMongoId()
    @IsNotEmpty()
    customer: Types.ObjectId;
} 