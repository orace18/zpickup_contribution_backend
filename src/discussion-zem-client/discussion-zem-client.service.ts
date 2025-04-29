import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiscussionZemClientDto } from './dto/create-discussion-zem-client.dto';
import { UpdateDiscussionZemClientDto } from './dto/update-discussion-zem-client.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DiscussionZemClientMessage } from 'src/Schemas/discussion_zem_client/discussion_zem_client_message.schema';
import { UsersService } from 'src/users/users.service';
import { CreateDiscussionZemClientMessageDto } from './dto/create-discussion-zem-client-message.dto';
import { DiscussionZemClient } from 'src/Schemas/discussion_zem_client/discussion_zem_client.schema';
import { sendNotification } from 'src/services/helpers.service';

@Injectable()
export class DiscussionZemClientService {
  constructor(
    @InjectModel(DiscussionZemClient.name)
    private discussionZemClientModel: Model<DiscussionZemClient>,
    @InjectModel(DiscussionZemClientMessage.name)
    private discussionZemClientMessageModel: Model<DiscussionZemClientMessage>,
    private readonly usersService: UsersService,
  ) {}


  async createDiscussion(createDto: CreateDiscussionZemClientDto): Promise<DiscussionZemClient> {
    const discussion = new this.discussionZemClientModel(createDto);
    return discussion.save();
}

async addMessage(createMessageDto: CreateDiscussionZemClientMessageDto, senderId: string): Promise<DiscussionZemClientMessage> {
  const discussion = await this.discussionZemClientModel.findById(createMessageDto.discussionId);
  if (!discussion) {
      throw new NotFoundException('Discussion non trouvée');
  }

  // Vérifier si l'expéditeur fait partie de la discussion
  if (!this.isUserInDiscussion(discussion, senderId)) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à envoyer des messages dans cette discussion');
  }

  const newMessage = new this.discussionZemClientMessageModel({
      ...createMessageDto,
      sender: senderId,
      discussion: createMessageDto.discussionId
  });

  const savedMessage = await newMessage.save();
  
  // Mettre à jour la discussion avec le nouveau message
  discussion.messages.push(savedMessage._id);
  await discussion.save();

  // Récupérer le message avec le sender peuplé
  const populatedMessage = await this.discussionZemClientMessageModel
      .findById(savedMessage._id)
      .populate('sender')
      .exec();

  // Envoyer la notification à l'autre participant
  const otherParticipantId = discussion.creators.zem.toString() === senderId 
      ? discussion.creators.customer 
      : discussion.creators.zem;

  const otherParticipant = await this.usersService.findOne(otherParticipantId.toString());
  
  if (otherParticipant && otherParticipant.fcm_token) {
      const title = 'Nouveau message';
      const body = `${populatedMessage.sender.firstname} ${populatedMessage.sender.lastname}: ${populatedMessage.content}`;
      
      const send_data = {
          _id: discussion._id.toString(),
          type: 'new_zem_client_message',
          value: JSON.stringify(populatedMessage),
      };

      console.log('Envoi de notification à l\'autre participant');
      try {
          await sendNotification(title, body, otherParticipant.fcm_token, send_data);
          console.log('Notification envoyée avec succès');
      } catch (notifError) {
          console.error("Erreur lors de l'envoi de notification:", notifError);
          // Continuer malgré l'erreur de notification
      }
  }

  return populatedMessage;
}

async getDiscussionMessages(discussionId: string, userId: string) {
  const discussion = await this.discussionZemClientModel.findById(discussionId);
  if (!discussion) {
      throw new NotFoundException('Discussion non trouvée');
  }

  if (!this.isUserInDiscussion(discussion, userId)) {
      throw new ForbiddenException('Vous n\'avez pas accès à cette discussion');
  }

  return this.discussionZemClientMessageModel
      .find({ discussion: discussionId })
      .populate('sender')
      .sort({ created_at: 1 })
      .exec();
}

async getUserDiscussions(userId: string) {
  return this.discussionZemClientModel
      .find({
          $or: [
              { 'creators.zem': userId },
              { 'creators.customer': userId }
          ]
      })
      .populate('race')
      .populate('creators.zem', ['firstname', 'lastname'])
      .populate('creators.customer', ['firstname', 'lastname'])
      .sort({ updated_at: -1 })
      .exec();
}

private isUserInDiscussion(discussion: DiscussionZemClient, userId: string): boolean {
  return discussion.creators.zem.toString() === userId || 
         discussion.creators.customer.toString() === userId;
}

  findAll() {
    return `This action returns all discussionZemClient`;
  }

  findOne(id: number) {
    return `This action returns a #${id} discussionZemClient`;
  }

  update(id: number, updateDiscussionZemClientDto: UpdateDiscussionZemClientDto) {
    return `This action updates a #${id} discussionZemClient`;
  }

  remove(id: number) {
    return `This action removes a #${id} discussionZemClient`;
  }
}
