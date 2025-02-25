import { PartialType } from '@nestjs/swagger';
import { CreateTermsConditionDto } from './create-terms_condition.dto';

export class UpdateTermsConditionDto extends PartialType(CreateTermsConditionDto) {}
