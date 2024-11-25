import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Counter } from '../Schemas/counter_schema/counter.schema';
import { Model } from 'mongoose';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
  ) {}

  async sendLowBalanceAlert(zemId: string, balance: number) {
    const notification = {
      type: 'LOW_BALANCE_NOTIFICATION_ALERT',
      message: `Attention! Votre solde est bas: ${balance} km`,
      zemId,
      timestamp: new Date().toISOString(),
    };
    // simulation d'un envoie de notification
    console.log('Notification envoyée: ', notification);

    return notification;
  }

  async sendPaymentConfirmation(zemId: string, balance: number) {
    const notification = {
      type: 'SEND_PAYMENT_CONFIRAMATION',
      message: `succès! Vous avez effectué un rechargement de ${balance} km`,
      zemId,
      timestamp: new Date().toISOString(),
    };
    // simulation d'un envoie de notification
    console.log('Notification envoyée: ', notification);

    return notification;
  }
}