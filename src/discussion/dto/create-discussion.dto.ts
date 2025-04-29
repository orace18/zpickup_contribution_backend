import { IsNotEmpty, IsString } from "class-validator";

export class CreateDiscussionDto {
    @IsString()
    @IsNotEmpty()
    title: string;
}
