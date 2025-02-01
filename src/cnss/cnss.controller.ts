import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CnssService } from './cnss.service';
import { CreateCnssDto } from './dto/create-cnss.dto';
import { UpdateCnssDto } from './dto/update-cnss.dto';

@Controller('cnss')
export class CnssController {
  constructor(private readonly cnssService: CnssService) {}

  @Post()
  create(@Body() createCnssDto: CreateCnssDto) {
    return this.cnssService.create(createCnssDto);
  }

  @Get()
  findAll() {
    return this.cnssService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cnssService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCnssDto: UpdateCnssDto) {
    return this.cnssService.update(+id, updateCnssDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cnssService.remove(+id);
  }
}
