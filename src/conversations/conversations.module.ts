import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from 'src/Schemas/conversation_schema/conversation.schema';
import { ConversationMessage, ConversationMessageSchema } from 'src/Schemas/create_conversation_message_schema/conversation_message_schema';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: ConversationMessage.name, schema: ConversationMessageSchema },
    ]),
    MulterModule.register({
      dest: './uploads/conversations',
    }),
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService],
})
export class ConversationsModule {}
