import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Types} from "mongoose";
import {Type} from "class-transformer";
import {CoursesStatus} from "../../Schemas/races_schema/races.schema";

export class CreateRaceDto {

    @IsOptional()
    user?:  Types.ObjectId;

    @IsNumber()
    @IsNotEmpty()
    initial_longitude: number;

    @IsNumber()
    @IsNotEmpty()
    initial_latitude: number;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    initial_datetime: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    datetime_debut?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    datetime_fin?: Date;

    @IsOptional()
    @IsNumber()
    longitude_start?: number;

    @IsOptional()
    @IsNumber()
    latitude_start?: number;

    @IsOptional()
    @IsNumber()
    longitude_end?: number;

    @IsOptional()
    @IsNumber()
    latitude_end?: number;

    @IsString()
    @IsOptional()
    reference: string;

    @IsString()
    @IsOptional()
    qrcode_start: string;

    @IsString()
    @IsOptional()
    qrcode_end: string;

    @IsNumber()
    @IsOptional()
    distance_traveled: number;

    @IsEnum(CoursesStatus)
    @IsOptional()
    status: CoursesStatus;

}
