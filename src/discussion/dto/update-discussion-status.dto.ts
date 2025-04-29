import { IsBoolean } from 'class-validator';

export class UpdateDiscussionStatusDto {
    @IsBoolean()
    is_open: boolean;
}