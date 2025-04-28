import { IsMongoId, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { CreatorsDto } from './creators.dto';

export class CreateDiscussionZemClientDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsMongoId()
    @IsNotEmpty()
    race: Types.ObjectId;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreatorsDto)
    creators: CreatorsDto;
}