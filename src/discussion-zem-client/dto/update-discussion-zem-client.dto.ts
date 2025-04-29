import { PartialType } from '@nestjs/swagger';
import { CreateDiscussionZemClientDto } from './create-discussion-zem-client.dto';

export class UpdateDiscussionZemClientDto extends PartialType(CreateDiscussionZemClientDto) {}
