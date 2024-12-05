import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from '../Schemas/notifications_schema/notifications.schema';

export enum NotificationType {
  LOW_BALANCE = 'LOW_BALANCE_NOTIFICATION_ALERT',
  NEGATIVE_BALANCE = 'NEGATIVE_BALANCE_NOTIFICATION_ALERT',
  DEBT_SETTLED = 'DEBT_SETTLED',
  PARTIAL_DEBT_SETTLED = 'PARTIAL_DEBT_SETTLED',
  PAYMENT_CONFIRMATION = 'PAYMENT_CONFIRMATION',
}

interface NotificationData {
  balance?: number;
  settledAmount?: number;
  remainingDebt?: number;
  zemId: string;
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async globalNotificationService(
    type: NotificationType,
    userId: string,
    data: NotificationData,
  ) {
    let title: string;
    let message: string;

    switch (type) {
      case NotificationType.LOW_BALANCE:
        title = 'Solde Bas';
        message = `Attention! Votre solde est bas: ${data.balance} km`;
        break;

      case NotificationType.NEGATIVE_BALANCE:
        title = 'Solde Négatif';
        message = `Attention! Votre solde est négatif: ${data.balance} km. Vous devrez rembourser ce montant lors de votre prochaine recharge`;
        break;

      case NotificationType.DEBT_SETTLED:
        title = 'Dette Remboursée';
        message = `Votre dette de ${data.settledAmount} km a été entièrement remboursée.`;
        break;

      case NotificationType.PARTIAL_DEBT_SETTLED:
        title = 'Dette Partiellement Remboursée';
        message = `${data.settledAmount} km de votre dette ont été remboursés. Dette restante: ${data.remainingDebt} km`;
        break;

      case NotificationType.PAYMENT_CONFIRMATION:
        title = 'Paiement Confirmé';
        message = `Succès! Vous avez effectué un rechargement de ${data.balance} km`;
        break;
    }

    const notification = new this.notificationModel({
      user: new Types.ObjectId(userId),
      title,
      message,
      data: {
        type,
        ...data,
      },
    });

    const savedNotification = await notification.save();

    console.log('Notification envoyée:', {
      type,
      title,
      message,
      data,
      timestamp: new Date().toISOString(),
    });

    return savedNotification;
  }
}
