import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTermsConditionDto {
    @IsOptional()
    @IsString()
    key?: string;

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    description: string
}
