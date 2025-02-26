import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Discussion, DiscussionDocument } from 'src/Schemas/discussion_schema/discussion.schema';
import { Model } from 'mongoose';
import { DiscussionMessage, DiscussionMessageDocument } from 'src/Schemas/discussion_message/discussion_message.schema';
import { DiscussionResponseDto } from './dto/discussion-response.dto';
import { CreateDiscussionMessageDto, DiscussionMessageResponseDto } from './dto/discussion-message.dto';
import { Message } from 'src/Schemas/message/message.schema';
import { UsersService } from 'src/users/users.service';
import { sendNotification } from 'src/services/helpers.service';

@Injectable()
export class DiscussionService {

  constructor(
    @InjectModel(Discussion.name) private discussionModel: Model<DiscussionDocument>,
    @InjectModel(DiscussionMessage.name) private messageModel: Model<DiscussionMessageDocument>,
    private readonly usersService: UsersService,
  ) { }

  async createDiscussion(createDiscussionDto: CreateDiscussionDto, userId: string): Promise<DiscussionResponseDto> {
    try {
      const discussion = new this.discussionModel({
        title: createDiscussionDto.title,
        creator: userId,
        messages: []
      });

      const savedDiscussion = await discussion.save();

      return {
        id: savedDiscussion._id.toString(),
        title: savedDiscussion.title,
        creator: savedDiscussion.creator,
        is_open: savedDiscussion.is_open,
        messages: savedDiscussion.messages,
        created_at: savedDiscussion.created_at,
        updated_at: savedDiscussion.updated_at
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la création de la discussion: ' + error.message
      );
    }
  }

  async getDiscussion(id: string): Promise<DiscussionResponseDto> {
    const discussion = await this.discussionModel
      .findById(id)
      .populate('messages')
      .populate('creator')
      .exec();

    if (!discussion) {
      throw new NotFoundException('Discussion non trouvée');
    }

    return this.toDiscussionDto(discussion);
  }

  async getAllDiscussions(): Promise<DiscussionResponseDto[]> {
    const discussions = await this.discussionModel
      .find()
      .populate('creator')
      .exec();
    return discussions.map(discussion => this.toDiscussionDto(discussion));
  }

  async getUserDiscussions(userId: string): Promise<DiscussionResponseDto[]> {
    const discussions = await this.discussionModel
      .find({ creator: userId })
      .populate('creator')
      .exec();
    return discussions.map(discussion => this.toDiscussionDto(discussion));
  }

  async addMessageToDiscussion(
    createDiscussionMessageDto: CreateDiscussionMessageDto,
    userId: string,
  ): Promise<DiscussionMessageResponseDto> {
    const discussion = await this.discussionModel.findById(createDiscussionMessageDto.discussionId)

    if (!discussion) {
      throw new NotFoundException('Discussion non trouvée');
    }

    const sender = await this.usersService.findOne(userId);

    if (sender.user_type === 'admin') {
      discussion.is_open = false;
      await discussion.save();
    }

    const newMessage = new this.messageModel({
      content: createDiscussionMessageDto.content,
      discussion: createDiscussionMessageDto.discussionId,
      sender: userId
    });

    const savedMessage = await newMessage.save();
    discussion.messages.push(savedMessage._id.toString());
    await discussion.save();

    const message = await this.messageModel.findById(savedMessage._id).populate({
      path: 'sender',
      select: 'user_type _id'
    });

    if (sender.user_type === 'admin') {
      const title = `Discussion: ${discussion.title}`;
      const body = `${createDiscussionMessageDto.content}`;

      const creator = await this.usersService.findOne(discussion.creator);

      if (creator.fcm_token) {
        const send_data = {
          _id: discussion._id.toString(),
          type: "new_message",
          value: JSON.stringify(message),
        }
        await sendNotification(title, body, creator.fcm_token, send_data)
      }
    } else {
      // Si c'est un utilisateur qui envoie le message, notifier les admins
      const title = `Nouvelle réponse de ${sender.firstname} ${sender.lastname}`;
      const body = `${createDiscussionMessageDto.content}`;

      // Récupérer tous les admins
      const admins = await this.usersService.findAllAdmins();

      // Envoyer la notification à chaque admin
      for (const admin of admins) {
        if (admin.fcm_token) {
          const send_data = {
            _id: discussion._id.toString(),
            type: "new_message",
            value: JSON.stringify(message),
          }
          await sendNotification(title, body, admin.fcm_token, send_data);
        }
      }
    }

    return this.toDiscussionMessageDto(savedMessage);
  }

  async getDiscussionMessages(discussionId: string) {
    const discussion = await this.discussionModel
      .findById(discussionId)
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          select: 'user_type _id user'
        }
      })
     
      .lean()
      .exec();

    if (!discussion) {
      throw new NotFoundException('Discussion non trouvée');
    }

    return discussion.messages.map((message: any) => ({
      id: message._id.toString(),
      content: message.content,
      discussion: message.discussion.toString(),
      sender: {
        userId: message.sender._id.toString(),
        user_type: message.sender.user_type
      },
      created_at: message.createdAt,
      updated_at: message.updatedAt
    }));
  }

  async deleteDiscussion(id: string): Promise<void> {
    const discussion = await this.discussionModel.findById(id);
    if (!discussion) {
      throw new NotFoundException('Discussion non trouvée');
    }
    await this.messageModel.deleteMany({ discussion: id });
    await discussion.deleteOne();
  }

  async updateDiscussionStatus(id: string, is_open: boolean): Promise<DiscussionResponseDto> {
    const discussion = await this.discussionModel.findById(id);

    if (!discussion) {
      throw new NotFoundException('Discussion non trouvée');
    }

    discussion.is_open = is_open;
    const updatedDiscussion = await discussion.save();

    return this.toDiscussionDto(updatedDiscussion);
  }


  private toDiscussionDto(discussion: DiscussionDocument): DiscussionResponseDto {
    return {
      id: discussion._id.toString(),
      title: discussion.title,
      creator: discussion.creator.toString(),
      is_open: discussion.is_open,
      messages: discussion.messages.map(message => message.toString()),
      created_at: discussion.created_at,
      updated_at: discussion.updated_at,
    };
  }

  private toDiscussionMessageDto(discussionMessage: DiscussionMessageDocument): DiscussionMessageResponseDto {
    return {
      id: discussionMessage._id.toString(),
      content: discussionMessage.content,
      discussion: discussionMessage.discussion.toString(),
      sender: discussionMessage.sender.toString(),
      created_at: discussionMessage.created_at,
      updated_at: discussionMessage.updated_at,
    };
  }
}
