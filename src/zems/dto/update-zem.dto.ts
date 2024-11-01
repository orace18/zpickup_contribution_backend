import { PartialType } from '@nestjs/mapped-types';
import { CreateZemDto } from './create-zem.dto';
import {IsDate, IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {ProfileValidationStatus} from "../../Schemas/zems_schema/Zems.schema";

export class UpdateZemDto extends PartialType(CreateZemDto) {

    @IsEnum(ProfileValidationStatus)
    @IsNotEmpty()
    profile_validation_status: ProfileValidationStatus;

}
