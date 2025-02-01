import { PartialType } from '@nestjs/swagger';
import { CreateRaceDto } from './create-race.dto';
import {IsDate, IsNotEmpty, IsOptional} from "class-validator";
import {Type} from "class-transformer";
import {Types} from "mongoose";
import {Prop} from "@nestjs/mongoose";

export class UpdateRaceDto extends PartialType(CreateRaceDto) {

    @IsNotEmpty()
    type_action: string;


    @IsOptional()
    @IsDate()
    @Type(() => Date)
    stopped_at?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    accepted_at?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    started_at?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    ended_at?: Date;

    @IsOptional()
    zem?: Types.ObjectId;

    @IsOptional()
    longitude_start?: number;

    @IsOptional()
    latitude_start?: number;

    @IsOptional()
    qrcode_start_value?: string;


    @IsOptional()
    longitude_end?: number;

    @IsOptional()
    latitude_end?: number;

    @IsOptional()
    qrcode_end_value?: string;


    @IsOptional()
    distance_traveled?: number;


    @IsOptional()
    code_pin: string;

    @IsOptional()
    service_km: number;

    @IsOptional()
    service_duration: number;


    @IsOptional()
    street_start: string;

    @IsOptional()
    country_start: string;

    @IsOptional()
    locality_start: string;


    @IsOptional()
    street_end: string;

    @IsOptional()
    country_end: string;

    @IsOptional()
    locality_end: string;

    @IsOptional()
    street_accepted: string;

    @IsOptional()
    country_accepted: string;

    @IsOptional()
    locality_accepted: string;

    @IsOptional()
    longitude_accepted?: number;

    @IsOptional()
    latitude_accepted?: number;


}
