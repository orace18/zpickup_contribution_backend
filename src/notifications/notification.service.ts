import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from '../Schemas/notifications_schema/notifications.schema';
import { ConfigService } from '@nestjs/config';
import * as process from 'node:process';

@Injectable()
export class NotificationService {
  private readonly notificationColors: { [key: string]: string };
  private readonly notificationTypes: string[];
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    private configService: ConfigService,
  ) {
    /* Initialisation des couleurs */
    this.notificationColors = {
      promotion: process.env.NOTIFICATION_COLOR_PROMOTION,
      commande: process.env.NOTIFICATION_COLOR_COMMANDE,
      probleme: process.env.NOTIFICATION_COLOR_PROBLEME,
      order: process.env.NOTIFICATION_COLOR_ORDER,
      low_balance: process.env.NOTIFICATION_COLOR_LOW_BALANCE,
      debt_settled: process.env.NOTIFICATION_COLOR_DEBT_SETTLED,
      partial_debt_settled: process.env.NOTIFICATION_COLOR_PARTIAL_DEBT_SETTLED,
      payment_confirmation: process.env.NOTIFICATION_COLOR_PAYMENT_CONFIRMATION,
      negative_balance: process.env.NOTIFICATION_COLOR_NEGATIVE_BALANCE,
    };

    /* Initialisation des types de notification */
    this.notificationTypes = this.configService
      .get<string>('NOTIFICATION_TYPES')
      .split(',')
      .map((type) => type.trim());
  }

  async createNotification(
    userId: string,
    title: string,
    message: string,
    notif_type: string,
    data?: object,
  ) {
    // Vérifier si le type de notification est valide
    if (!this.notificationTypes.includes(notif_type)) {
      throw new BadRequestException(
        `Type de notification invalide. Types valides: ${this.notificationTypes.join(
          ', ',
        )}`,
      );
    }

    // Récupérer la couleur correspondante
    const color = this.notificationColors[notif_type];
    if (!color) {
      throw new BadRequestException(
        `Couleur non définie pour le type: ${notif_type}`,
      );
    }

    const notification = new this.notificationModel({
      user: new Types.ObjectId(userId),
      title,
      message,
      notif_type: notif_type,
      color,
      data: data || {},
      is_read: false,
    });

    const savedNotification = await notification.save();

    console.log('Notification créée:', {
      userId,
      title,
      message,
      type: notif_type,
      color,
      timestamp: new Date().toISOString(),
    });

    return savedNotification;
  }

  async markAsRead(notificationId: string) {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { is_read: true },
      { new: true },
    );
  }

  async getUserNotifications(userId: string) {
    return await this.notificationModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ created_at: -1 })
      .exec();
  }

  async getUnreadNotifications(userId: string) {
    return await this.notificationModel
      .find({
        user: new Types.ObjectId(userId),
        is_read: false,
      })
      .sort({ created_at: -1 })
      .lean()
      .exec();
  }

  async deleteNotification(notificationId: string) {
    return this.notificationModel.findByIdAndDelete(notificationId);
  }
}
