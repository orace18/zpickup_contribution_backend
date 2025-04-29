import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GSMNumberFormatService } from './gsmnumber-format.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('gsm-number-format')
export class GSMNumberFormatController {
  constructor(private readonly gsmnumberFormatService: GSMNumberFormatService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() { prefix, operator_name }: { prefix: string, operator_name: string }) {
    return this.gsmnumberFormatService.create(prefix, operator_name);
  }

  @Get()
  findAll() {
    return this.gsmnumberFormatService.findAll();
  }
}
