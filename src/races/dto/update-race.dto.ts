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



}
