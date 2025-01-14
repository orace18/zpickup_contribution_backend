import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';

@Controller('configs')
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) {}

  @Post()
  create(@Body() createConfigDto: CreateConfigDto) {
    return this.configsService.create(createConfigDto);
  }

  @Get()
  findAll() {
    return this.configsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configsService.findOne(+id);
  }

  @Get('by-key/:key_value')
  findOneByKey(@Param('key_value') key_value: string) {
    return this.configsService.findConfigOneByKey(key_value);
  }

  @Patch('by-key/:key_value')
  updateByKey(
    @Param('key_value') key_value: string,
    @Body() updateConfigDto: UpdateConfigDto
  ) {
    return this.configsService.updateConfigByKey(key_value, updateConfigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.configsService.remove(+id);
  }
}
