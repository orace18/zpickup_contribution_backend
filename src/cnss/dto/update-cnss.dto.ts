import { PartialType } from '@nestjs/mapped-types';
import { CreateCnssDto } from './create-cnss.dto';

export class UpdateCnssDto extends PartialType(CreateCnssDto) {}
