import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RaceHistoryService } from './race_history.service';
import { CreateRaceHistoryDto } from './dto/create-race_history.dto';
import { UpdateRaceHistoryDto } from './dto/update-race_history.dto';

@Controller('race-history')
export class RaceHistoryController {
  constructor(private readonly raceHistoryService: RaceHistoryService) {}

  @Post()
  create(@Body() createRaceHistoryDto: CreateRaceHistoryDto) {
    return this.raceHistoryService.create(createRaceHistoryDto);
  }

  @Get()
  findAll() {
    return this.raceHistoryService.findAll();
  }

  @Get('live/locations/:race_id')
  findRaceLiveLocation(@Param('race_id') race_id: string) {
    return this.raceHistoryService.findRaceLiveLocation(race_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.raceHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRaceHistoryDto: UpdateRaceHistoryDto) {
    return this.raceHistoryService.update(+id, updateRaceHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.raceHistoryService.remove(+id);
  }
}
