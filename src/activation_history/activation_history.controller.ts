import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActivationHistoryService } from './activation_history.service';
import { CreateActivationHistoryDto } from './dto/create-activation_history.dto';
import { UpdateActivationHistoryDto } from './dto/update-activation_history.dto';

@Controller('activation-history')
export class ActivationHistoryController {
  constructor(private readonly activationHistoryService: ActivationHistoryService) {}

  @Post()
  create(@Body() createActivationHistoryDto: CreateActivationHistoryDto) {
    return this.activationHistoryService.create(createActivationHistoryDto);
  }

  @Get()
  findAll() {
    return this.activationHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activationHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActivationHistoryDto: UpdateActivationHistoryDto) {
    return this.activationHistoryService.update(+id, updateActivationHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activationHistoryService.remove(+id);
  }
}
