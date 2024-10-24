import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ZemsService } from './zems.service';
import { CreateZemDto } from './dto/create-zem.dto';
import { UpdateZemDto } from './dto/update-zem.dto';

@Controller('zems')
export class ZemsController {
  constructor(private readonly zemsService: ZemsService) {}

  @Post()
  create(@Body() createZemDto: CreateZemDto) {
    return this.zemsService.create(createZemDto);
  }

  @Get()
  findAll() {
    return this.zemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.zemsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateZemDto: UpdateZemDto) {
    return this.zemsService.update(id, updateZemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zemsService.remove(id);
  }
}
