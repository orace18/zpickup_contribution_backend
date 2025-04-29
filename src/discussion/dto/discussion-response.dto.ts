export class DiscussionResponseDto {
    id: string;
    title: string;
    creator: string;
    is_open: boolean;
    messages: string[];
    created_at: Date;
    updated_at: Date;
}