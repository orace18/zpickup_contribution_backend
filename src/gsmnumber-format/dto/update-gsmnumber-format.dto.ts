import { PartialType } from '@nestjs/swagger';
import { CreateGsmnumberFormatDto } from './create-gsmnumber-format.dto';

export class UpdateGsmnumberFormatDto extends PartialType(CreateGsmnumberFormatDto) {}
