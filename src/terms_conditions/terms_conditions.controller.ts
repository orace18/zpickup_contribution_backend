import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TermsConditionsService } from './terms_conditions.service';
import { CreateTermsConditionDto } from './dto/create-terms_condition.dto';
import { UpdateTermsConditionDto } from './dto/update-terms_condition.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('terms-conditions')
@Controller('terms-conditions')
export class TermsConditionsController {
  constructor(private readonly termsConditionsService: TermsConditionsService) {}

  @Post()
  create(@Body() createTermsConditionDto: CreateTermsConditionDto) {
    return this.termsConditionsService.create(createTermsConditionDto);
  }

  @Get()
  findAll() {
    return this.termsConditionsService.findAll();
  }

  @Get('key/:key')
  findByKey(@Param('key') key: string) {
    return this.termsConditionsService.findByKey(key);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.termsConditionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTermsConditionDto: UpdateTermsConditionDto) {
    return this.termsConditionsService.update(id, updateTermsConditionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.termsConditionsService.remove(id);
  }
}