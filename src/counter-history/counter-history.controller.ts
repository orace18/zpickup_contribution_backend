import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CounterHistoryService } from './counter-history.service';
import { CreateCounterHistoryDto } from './dto/create-counter-history.dto';
import { UpdateCounterHistoryDto } from './dto/update-counter-history.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('counter-history')
@UseGuards(JwtAuthGuard)
@Controller('counter-history')
export class CounterHistoryController {
  constructor(private readonly counterHistoryService: CounterHistoryService) {}

  @Get(':zemId')
  @ApiOperation({ summary: 'Get counter history' })
  getCounterHistory(@Param('zemId') zemId: string) {
    return this.counterHistoryService.getCounterHistory(zemId);
  }

  @Post()
  create(@Body() createCounterHistoryDto: CreateCounterHistoryDto) {
    return this.counterHistoryService.create(createCounterHistoryDto);
  }

  @Get()
  findAll() {
    return this.counterHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.counterHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCounterHistoryDto: UpdateCounterHistoryDto) {
    return this.counterHistoryService.update(+id, updateCounterHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.counterHistoryService.remove(+id);
  }
}
