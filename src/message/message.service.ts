import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { UsersService } from 'src/users/users.service';
import { callZem, sendMessage, sendNotification } from 'src/services/helpers.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  async sendMessageToZem(clientId: string, zemPhoneNumber: string, message: string) {
    try {
      // Récupérer les informations du client
      const client = await this.usersService.findOne(clientId);
      if (!client) {
        throw new NotFoundException('Client non trouvé');
      }

      // Récupérer le zem par son numéro de téléphone
      const zem = await this.usersService.findByPhone(zemPhoneNumber);
      
      console.log('Numéro de téléphone du zem:', zemPhoneNumber);

      const messageContent = `Vous avez reçu un message de: ${client.firstname} ${client.lastname}\n\n${message}`;

      // Envoyer le SMS via Twilio 
      sendMessage(messageContent, zemPhoneNumber);

      // Si on trouve le zem dans la base de données, on envoie aussi une notification push
      if (zem?.fcm_token) {
        sendNotification(
          'Nouveau message',
          `Nouveau message de ${client.firstname} ${client.lastname}`,
          zem.fcm_token,
          {
            type: 'new_message',
            senderId: clientId,
            message: message
          }
        );
      }

      return {
        message: message
      };

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  }

  async callZem(phoneNumber: string) {
    try {
      console.log('Appel vers le numéro:', phoneNumber);
      await callZem(phoneNumber);
      
      return {
        success: true,
        message: 'Appel initié avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de l\'appel:', error);
      throw error;
    }
  }

  // Pour que "ZPickup" s'affiche comme identifiant d'appel, 
  // vous devrez configurer cela dans les paramètres de votre compte Twilio (Caller ID Configuration).


  create(createMessageDto: CreateMessageDto) {
    return 'This action adds a new message';
  }

  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
