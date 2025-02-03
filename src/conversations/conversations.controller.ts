import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreateConversationMessageDto } from './dto/create-converstion-message.dto';

@Controller('chat')
export class ConversationsController {
  constructor(private readonly conversationService: ConversationsService) {}

  @Post('conversations')
  createConversation(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationService.createConversation(createConversationDto);
  }

  @Get('conversations/:id')
  getConversation(@Param('id') id: string) {
    return this.conversationService.getConversation(id);
  }

  @Get('conversations/messages/:id')
  getConversationMessages(@Param('id') id: string) {
    return this.conversationService.getConversationMessages(id);
  }

  @Post('messages')
  async createMessage(@Body() createConversationMessageDto: CreateConversationMessageDto) {
    try {
      return await this.conversationService.createMessage(createConversationMessageDto);
    } catch (error) {
      // Améliorer la gestion des erreurs
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Erreur lors de la création du message');
    }
  }

  /* @Post('messages')
  createMessage(@Body() createConversationMessageDto: CreateConversationMessageDto) {
    return this.conversationService.createMessage(createConversationMessageDto);
  } */

  @Patch('messages/read/:id')
  markMessageAsRead(@Param('id') id: string) {
    return this.conversationService.markMessageAsRead(id);
  }
}
