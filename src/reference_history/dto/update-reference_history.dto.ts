import { PartialType } from '@nestjs/swagger';
import { CreateReferenceHistoryDto } from './create-reference_history.dto';

export class UpdateReferenceHistoryDto extends PartialType(CreateReferenceHistoryDto) {}
