import {Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile} from '@nestjs/common';
import { ZemsService } from './zems.service';
import { CreateZemDto } from './dto/create-zem.dto';
import { UpdateZemDto } from './dto/update-zem.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiBody, ApiConsumes} from "@nestjs/swagger";

@Controller('zems')
export class ZemsController {
  constructor(private readonly zemsService: ZemsService) {}

  @UseInterceptors(FileInterceptor('card_image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Zems with files',
    type: CreateZemDto,
  })
  @Post()
  create(@Body() createZemDto: CreateZemDto, @UploadedFile() card_image: Express.Multer.File,) {
    createZemDto.card_image = card_image;
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
