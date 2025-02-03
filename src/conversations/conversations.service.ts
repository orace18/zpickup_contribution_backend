import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation, ConversationDocument } from 'src/Schemas/conversation_schema/conversation.schema';
import { Model } from 'mongoose';
import { ConversationMessage, ConversationMessageDocument, ConversationMessageSchema } from 'src/Schemas/create_conversation_message_schema/conversation_message_schema';
import { CreateConversationMessageDto } from './dto/create-converstion-message.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
    @InjectModel(ConversationMessage.name) private conversationMessageModel: Model<ConversationMessageDocument>,
  ) {}

  async createConversation(createConversationDto: CreateConversationDto) {

    const conversationData = {
      user: createConversationDto.userId,
      admin: createConversationDto.adminId
    };

    const conversation = new this.conversationModel(conversationData);
    const savedConversation = await conversation.save();

    // Créer le message de bienvenue
    const welcomeMessage = new this.conversationMessageModel({
      conversation: savedConversation._id,
      sender: savedConversation.admin,
      text: `Bienvenue cher(e) client. Comment pouvons nous vous aider ?`,
    });
    await welcomeMessage.save();

    return savedConversation;
  }

  async getConversation(id: string) {
    const conversation = await this.conversationModel.findById(id);
    if (!conversation) {
      throw new NotFoundException('Conversation non trouvée');
    }
    return conversation;
  }

  async getConversationMessages(conversationId: string) {
    return this.conversationMessageModel
      .find({ conversation: conversationId })
      .sort({ createdAt: 1 });
  }

  async createMessage(createConversationMessageDto: CreateConversationMessageDto) {
    try {
      // Vérifier si la conversation existe
      const conversation = await this.conversationModel.findById(createConversationMessageDto.conversationId);
      if (!conversation) {
        throw new NotFoundException('Conversation non trouvée');
      }

      // Créer le nouveau message
      const newMessage = new this.conversationMessageModel({
        conversation: createConversationMessageDto.conversationId,
        sender: createConversationMessageDto.senderId,
        text: createConversationMessageDto.text,
        fileType: createConversationMessageDto.fileType,
        fileUrl: createConversationMessageDto.fileUrl,
      });

      const savedMessage = await newMessage.save();
      return savedMessage;
    } catch (error) {
      // Logger l'erreur pour le débogage
      console.error('Erreur lors de la création du message:', error);
      throw error;
    }
  }

  /* async createMessage(createConversationMessageDto: CreateConversationMessageDto) {
    const message = new this.conversationMessageModel(createConversationMessageDto);
    return message.save();
  } */

  async markMessageAsRead(messageId: string) {
    return this.conversationMessageModel.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true },
    );
  }

  create(createConversationDto: CreateConversationDto) {
    return 'This action adds a new conversation';
  }

  findAll() {
    return `This action returns all conversations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} conversation`;
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
