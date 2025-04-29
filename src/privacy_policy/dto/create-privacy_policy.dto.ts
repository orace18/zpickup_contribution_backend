import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePrivacyPolicyDto {
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
