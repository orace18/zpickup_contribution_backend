import { PartialType } from '@nestjs/swagger';
import { CreateRaceHistoryDto } from './create-race_history.dto';

export class UpdateRaceHistoryDto extends PartialType(CreateRaceHistoryDto) {}
