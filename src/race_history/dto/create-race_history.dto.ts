import {IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Types} from "mongoose";
import {CoursesStatus} from "../../Schemas/races_schema/races.schema";

export class CreateRaceHistoryDto {
    @IsNotEmpty()
    user:  Types.ObjectId;

    @IsNotEmpty()
    race:  Types.ObjectId;

    @IsNumber()
    @IsNotEmpty()
    longitude: number;

    @IsNumber()
    @IsNotEmpty()
    latitude: number;

    @IsEnum(CoursesStatus)
    @IsNotEmpty()
    status: CoursesStatus;

    @IsString()
    @IsOptional()
    street: string;

    @IsString()
    @IsOptional()
    country: string;

    @IsString()
    @IsOptional()
    locality: string;

}
