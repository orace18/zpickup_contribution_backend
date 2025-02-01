import { PartialType } from '@nestjs/mapped-types';
import { CreateActivationHistoryDto } from './create-activation_history.dto';

export class UpdateActivationHistoryDto extends PartialType(CreateActivationHistoryDto) {}
