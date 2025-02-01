import { PartialType } from '@nestjs/mapped-types';
import { CreateCounterHistoryDto } from './create-counter-history.dto';

export class UpdateCounterHistoryDto extends PartialType(CreateCounterHistoryDto) {}
