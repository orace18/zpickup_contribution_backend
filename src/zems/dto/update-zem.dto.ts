import { PartialType } from '@nestjs/mapped-types';
import { CreateZemDto } from './create-zem.dto';
import {IsDate, IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {ProfileValidationStatus} from "../../Schemas/zems_schema/Zems.schema";

export class UpdateZemDto extends PartialType(CreateZemDto) {

    @IsNotEmpty()
    type_action: string;

    @IsOptional()
    validated_at: Date;

    @IsEnum(ProfileValidationStatus)
    @IsOptional()
    profile_validation_status: ProfileValidationStatus;

    @IsOptional()
    service: boolean;

    @IsOptional()
    service_latitude: number;

    @IsOptional()
    service_longitude: number;


}
