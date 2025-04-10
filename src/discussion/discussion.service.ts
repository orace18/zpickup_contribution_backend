import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Discussion,
  DiscussionDocument,
} from 'src/Schemas/discussion_schema/discussion.schema';
import { Model } from 'mongoose';
import {
  DiscussionMessage,
  DiscussionMessageDocument,
} from 'src/Schemas/discussion_message/discussion_message.schema';
import { DiscussionResponseDto } from './dto/discussion-response.dto';
import {
  CreateDiscussionMessageDto,
  DiscussionMessageResponseDto,
} from './dto/discussion-message.dto';
import { Message } from 'src/Schemas/message/message.schema';
import { UsersService } from 'src/users/users.service';
import { sendNotification } from 'src/services/helpers.service';

@Injectable()
export class DiscussionService {
  constructor(
    @InjectModel(Discussion.name)
    private discussionModel: Model<DiscussionDocument>,
    @InjectModel(DiscussionMessage.name)
    private messageModel: Model<DiscussionMessageDocument>,
    private readonly usersService: UsersService,
  ) {}

  async createDiscussion(
    createDiscussionDto: CreateDiscussionDto,
    userId: string,
  ): Promise<DiscussionResponseDto> {
    try {
      const discussion = new this.discussionModel({
        title: createDiscussionDto.title,
        creator: userId,
        messages: [],
      });

      const savedDiscussion = await discussion.save();

      return {
        id: savedDiscussion._id.toString(),
        title: savedDiscussion.title,
        creator: savedDiscussion.creator,
        is_open: savedDiscussion.is_open,
        messages: savedDiscussion.messages,
        created_at: savedDiscussion.created_at,
        updated_at: savedDiscussion.updated_at,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la création de la discussion: ' + error.message,
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
    return discussions.map((discussion) => this.toDiscussionDto(discussion));
  }

  async getUserDiscussions(userId: string): Promise<DiscussionResponseDto[]> {
    const discussions = await this.discussionModel
      .find({ creator: userId })
      .populate('creator')
      .exec();
    return discussions.map((discussion) => this.toDiscussionDto(discussion));
  }

  async addMessageToDiscussion(
    createDiscussionMessageDto: CreateDiscussionMessageDto,
    userId: string,
  ): Promise<DiscussionMessageResponseDto> {
    try {
      console.log(
        'Étape 1: Début de la méthode avec DTO:',
        createDiscussionMessageDto,
      );
      console.log(
        'Recherche de la discussion avec ID:',
        createDiscussionMessageDto.discussionId,
      );
      const discussion = await this.discussionModel.findById(
        createDiscussionMessageDto.discussionId,
      );
      console.log('Discussion trouvée:', discussion ? 'oui' : 'non');

      if (!discussion || !discussion._id) {
        console.log('Discussion non trouvée');
        throw new NotFoundException('Discussion non trouvée');
      }

      console.log("Étape 2: Recherche de l'utilisateur avec ID:", userId);
      const sender = await this.usersService.findOne(userId);
      console.log(
        'Utilisateur trouvé:',
        sender ? 'oui' : 'non',
        'Type:',
        sender?.user_type,
      );

      // Si l'admin répond, fermer la discussion
      if (sender.user_type === 'admin') {
        console.log('Utilisateur est admin, fermeture de la discussion');
        discussion.is_open = false;
        await discussion.save();
        console.log('Discussion fermée et sauvegardée');
      }

      // Vérifier si le message a du contenu ou un média
      console.log('Étape 3: Vérification du contenu du message');
      console.log('Content:', createDiscussionMessageDto.content);
      console.log('ImageUrl:', createDiscussionMessageDto.imageUrl);
      console.log('MediaUrl:', createDiscussionMessageDto.mediaUrl);

      if (
        !createDiscussionMessageDto.content &&
        !createDiscussionMessageDto.imageUrl &&
        !createDiscussionMessageDto.mediaUrl
      ) {
        console.log('Message sans contenu ni média');
        throw new BadRequestException(
          'Le message doit contenir du texte ou un média',
        );
      }

      console.log('Étape 4: Création du nouveau message');
      const newMessage = new this.messageModel({
        content: createDiscussionMessageDto.content,
        discussion: createDiscussionMessageDto.discussionId,
        sender: userId,
        imageUrl: createDiscussionMessageDto.imageUrl,
        mediaUrl: createDiscussionMessageDto.mediaUrl,
        mediaType: createDiscussionMessageDto.mediaType,
      });
      console.log('Nouveau message créé:', newMessage);

      console.log('Étape 5: Sauvegarde du message');
      const savedMessage = await newMessage.save();
      console.log('Message sauvegardé avec ID:', savedMessage._id);

      console.log('Étape 6: Mise à jour de la discussion');
      discussion.messages.push(savedMessage._id.toString());
      await discussion.save();
      console.log('Discussion mise à jour');

      // Gérer les notifications
      console.log('Étape 7: Récupération du message pour les notifications');
      const message = await this.messageModel
        .findById(savedMessage._id)
        .populate({
          path: 'sender',
          select: 'user_type _id firstname lastname',
        });
      console.log('Message récupéré avec sender:', message?.sender);

      // Préparer un corps de notification approprié
      const notificationBody =
        createDiscussionMessageDto.content || 'A envoyé un média';
      console.log('Corps de notification:', notificationBody);

      console.log('Étape 8: Envoi des notifications');
      if (sender.user_type === 'admin') {
        console.log('Notification pour utilisateur');
        const title = `Discussion: ${discussion.title}`;
        const body = notificationBody;

        console.log('Recherche du créateur:', discussion.creator);
        const creator = await this.usersService.findOne(discussion.creator);
        console.log(
          'Créateur trouvé:',
          creator ? 'oui' : 'non',
          'FCM token:',
          creator?.fcm_token ? 'présent' : 'absent',
        );

        if (creator.fcm_token) {
          const send_data = {
            _id: discussion._id.toString(),
            type: 'new_message',
            value: JSON.stringify(message),
          };
          console.log('Envoi de notification au créateur');
          try {
            await sendNotification(title, body, creator.fcm_token, send_data);
            console.log('Notification envoyée avec succès');
          } catch (notifError) {
            console.error(
              "Erreur lors de l'envoi de notification:",
              notifError,
            );
            // Continuez malgré l'erreur de notification
          }
        }
      } else {
        // Si c'est un utilisateur qui envoie le message, notifier les admins
        console.log('Notification pour admins');
        const title = `Nouvelle réponse de ${sender.firstname} ${sender.lastname}`;
        const body = notificationBody;

        // Récupérer tous les admins
        console.log('Récupération des admins');
        const admins = await this.usersService.findAllAdmins();
        console.log("Nombre d'admins trouvés:", admins.length);

        // Envoyer la notification à chaque admin
        console.log('Envoi des notifications aux admins');
        for (const admin of admins) {
          if (admin.fcm_token) {
            const send_data = {
              _id: discussion._id.toString(),
              type: 'new_message',
              value: JSON.stringify(message),
            };
            console.log('Envoi de notification à admin ID:', admin._id);
            try {
              await sendNotification(title, body, admin.fcm_token, send_data);
              console.log(
                'Notification envoyée avec succès à admin:',
                admin._id,
              );
            } catch (notifError) {
              console.error(
                "Erreur lors de l'envoi de notification à admin:",
                admin._id,
                notifError,
              );
              // Continuez malgré l'erreur de notification
            }
          }
        }
      }

      console.log('Étape 9: Conversion et retour du DTO');
      return this.toDiscussionMessageDto(savedMessage);
    } catch (error) {
      console.error('ERREUR dans addMessageToDiscussion:', error);
      throw error;
    }
  }

  async getDiscussionMessages(discussionId: string) {
    const discussion = await this.discussionModel
      .findById(discussionId)
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          select: 'user_type _id user',
        },
      })
      .lean()
      .exec();

    if (!discussion) {
      throw new NotFoundException('Discussion non trouvée');
    }

    // Ajoutez cette vérification
    if (!discussion.messages || discussion.messages.length === 0) {
      return []; // Retourne un tableau vide si pas de messages
    }

    return discussion.messages
      .map((message: any) => {
        // Ajoutez des vérifications supplémentaires
        if (!message || !message.sender) {
          console.warn('Message incomplet:', message);
          return null;
        }

        return {
          id: message._id?.toString(),
          content: message.content,
          discussion: message.discussion?.toString(),
          imageUrl: message.imageUrl,
          mediaUrl: message.mediaUrl,
          mediaType: message.mediaType,
          sender: {
            userId: message.sender?._id?.toString(),
            user_type: message.sender?.user_type,
          },
          created_at: message.createdAt,
          updated_at: message.updatedAt,
        };
      })
      .filter((message) => message !== null);
  }

  async deleteDiscussion(id: string): Promise<void> {
    const discussion = await this.discussionModel.findById(id);
    if (!discussion) {
      throw new NotFoundException('Discussion non trouvée');
    }
    await this.messageModel.deleteMany({ discussion: id });
    await discussion.deleteOne();
  }

  async updateDiscussionStatus(
    id: string,
    is_open: boolean,
  ): Promise<DiscussionResponseDto> {
    const discussion = await this.discussionModel.findById(id);

    if (!discussion) {
      throw new NotFoundException('Discussion non trouvée');
    }

    discussion.is_open = is_open;
    const updatedDiscussion = await discussion.save();

    return this.toDiscussionDto(updatedDiscussion);
  }

  private toDiscussionDto(
    discussion: DiscussionDocument,
  ): DiscussionResponseDto {
    return {
      id: discussion._id.toString(),
      title: discussion.title,
      creator: discussion.creator.toString(),
      is_open: discussion.is_open,
      messages: discussion.messages.map((message) => message.toString()),
      created_at: discussion.created_at,
      updated_at: discussion.updated_at,
    };
  }

  private toDiscussionMessageDto(
    message: DiscussionMessage,
  ): DiscussionMessageResponseDto {
    return {
      // id: message._id.toString(),
      content: message.content,
      discussion: message.discussion.toString(),
      sender: message.sender.toString(),
      imageUrl: message.imageUrl,
      mediaUrl: message.mediaUrl,
      mediaType: message.mediaType,
      created_at: message.created_at,
      updated_at: message.updated_at,
    };
  }
}
