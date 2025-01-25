import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('send-to-zem')
  async sendMessageToZem(
    @Req() req,
    @Body() payload: {
      phone_number: string,
      message: string
    }
  ) {
    return await this.messageService.sendMessageToZem(
      req.user.userId,
      payload.phone_number,
      payload.message
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('call-zem')
  async callZem(
    @Body() payload: {
      phone_number: string
    }
  ) {
    return await this.messageService.callZem(payload.phone_number);
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
