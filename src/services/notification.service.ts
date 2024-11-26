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

  async sendNegativeBalanceAlert(zemId: string, balance: number) {
    const notification = {
      type: 'NEGATIVE_BALANCE_NOTIFICATION_ALERT',
      message: `Attention! Votre solde est négatif: ${balance} km. Vous devrez rembourser ce montant lors de votre prochaine recharge`,
      zemId,
      timestamp: new Date().toISOString(),
    };

    console.log('Notification envoyée: ', notification);
    return notification;
  }

  async sendDebtSettledAlert(zemId: string, settledAmount: number) {
    const notification = {
      type: 'DEBT_SETTLED',
      message: `Votre dette de ${settledAmount} km a été entièrement remboursée.`,
      zemId,
      timestamp: new Date(),
    };

    console.log('Notification envoyée:', notification);
    return notification;
  }

  async sendPartialDebtSettledAlert(
    zemId: string,
    settledAmount: number,
    remainingDebt: number,
  ) {
    const notification = {
      type: 'PARTIAL_DEBT_SETTLED',
      message: `${settledAmount} km de votre dette ont été remboursés. Dette restante: ${remainingDebt} km`,
      zemId,
      timestamp: new Date(),
    };

    console.log('Notification envoyée:', notification);
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
