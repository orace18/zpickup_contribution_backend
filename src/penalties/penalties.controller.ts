import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PenaltiesService } from './penalties.service';
import { CreatePenaltyDto } from './dto/create-penalty.dto';
import { UpdatePenaltyDto } from './dto/update-penalty.dto';

@Controller('penalties')
export class PenaltiesController {
  constructor(private readonly penaltiesService: PenaltiesService) {}

  @Post()
  create(@Body() createPenaltyDto: CreatePenaltyDto) {
    return this.penaltiesService.create(createPenaltyDto);
  }

  @Get()
  findAll() {
    return this.penaltiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.penaltiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePenaltyDto: UpdatePenaltyDto) {
    return this.penaltiesService.update(+id, updatePenaltyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.penaltiesService.remove(+id);
  }
}
