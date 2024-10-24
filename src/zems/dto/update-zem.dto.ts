import { PartialType } from '@nestjs/mapped-types';
import { CreateZemDto } from './create-zem.dto';

export class UpdateZemDto extends PartialType(CreateZemDto) {}
