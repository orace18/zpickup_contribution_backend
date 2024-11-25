import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CounterService } from './counter.service';
import { CreateCounterDto } from './dto/create-counter.dto';
import { UpdateCounterDto } from './dto/update-counter.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePaymentDto } from '../payment/dto/create-payment.dto';
import { DeductKilometersDto } from '../payment/dto/deduct-kilometers.dto';

@ApiTags('counter')
@UseGuards(JwtAuthGuard)
@Controller('counter')
export class CounterController {
  constructor(private readonly counterService: CounterService) {}

  @Post('create/:zemId')
  @ApiOperation({ summary: 'Create a new counter for a validated Zem' })
  createCounter(@Param('zemId') zemId: string) {
    return this.counterService.createCounter(zemId);
  }

  @Post('payment/recharge/:zemId')
  @ApiOperation({ summary: 'Recharge a Zem counter' })
  rechargeCounter(@Param('zemId') zemId: string, @Body() createPaymentDto: CreatePaymentDto) {
    return this.counterService.rechargeCounter(zemId, createPaymentDto);
  }

  @Post('deduct-kilometers/:zemId')
  @ApiOperation({ summary: 'Deduct kilometers from counter' })
  deductKilometers(
    @Param('zemId') zemId: string,
    @Body() deductKilometersDto: DeductKilometersDto,
  ) {
    return this.counterService.deductKilometers(zemId, deductKilometersDto);
  }

  @Get('race-history/:zemId')
  @ApiOperation({ summary: 'Get counter history' })
  getCounterHistory(@Param('zemId') zemId: string) {
    return this.counterService.getCounterHistory(zemId);
  }

  @Get('balance-after-course/:zemId/:raceId')
  @ApiOperation({ summary: 'Get balance after a specific course' })
  @ApiParam({ name: 'zemId', description: 'ID of the Zem' })
  @ApiParam({ name: 'raceId', description: 'ID of the race/course' })
  getBalanceAfterCourse(
    @Param('zemId') zemId: string,
    @Param('raceId') raceId: string,
  ) {
    return this.counterService.getBalanceAfterCourse(zemId, raceId);
  }

  @Get('total-kilometers/:zemId')
  @ApiOperation({ summary: 'Get total kilometers traveled by a Zem' })
  @ApiParam({ name: 'zemId', description: 'ID of the Zem' })
  getTotalKilometers(@Param('zemId') zemId: string) {
    return this.counterService.getTotalKilometers(zemId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCounterDto: UpdateCounterDto) {
    return this.counterService.update(+id, updateCounterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.counterService.remove(+id);
  }
}
