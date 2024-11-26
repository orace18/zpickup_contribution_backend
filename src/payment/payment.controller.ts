import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('payment')
@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /*@Post('process-payment/:zemId')
  @ApiOperation({ summary: 'Process a payment for counter recharge' })
  processPayment(@Param('zemId') zemId: string, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.processPayment(zemId, createPaymentDto);
  }*/

  @Get('history/:zemId')
  @ApiOperation({ summary: 'Get payment history for a Zem' })
  getPaymentHistory(@Param('zemId') zemId: string) {
    return this.paymentService.getPaymentHistory(zemId);
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
