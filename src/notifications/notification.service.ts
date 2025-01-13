import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Notification } from '../Schemas/notifications_schema/notifications.schema';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_NOTIFICATION_CONFIG } from './notification.config';

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
      promotion:
        this.configService.get('NOTIFICATION_COLOR_PROMOTION') ||
        DEFAULT_NOTIFICATION_CONFIG.colors.promotion,
      commande:
        this.configService.get('NOTIFICATION_COLOR_COMMANDE') ||
        DEFAULT_NOTIFICATION_CONFIG.colors.commande,
      probleme:
        this.configService.get('NOTIFICATION_COLOR_PROBLEME') ||
        DEFAULT_NOTIFICATION_CONFIG.colors.probleme,
      order:
        this.configService.get('NOTIFICATION_COLOR_ORDER') ||
        DEFAULT_NOTIFICATION_CONFIG.colors.order,
      low_balance:
        this.configService.get('NOTIFICATION_COLOR_LOW_BALANCE') ||
        DEFAULT_NOTIFICATION_CONFIG.colors.low_balance,
      debt_settled:
        this.configService.get('NOTIFICATION_COLOR_DEBT_SETTLED') ||
        DEFAULT_NOTIFICATION_CONFIG.colors.debt_settled,
      partial_debt_settled:
        this.configService.get('NOTIFICATION_COLOR_PARTIAL_DEBT_SETTLED') ||
        DEFAULT_NOTIFICATION_CONFIG.colors.partial_debt_settled,
      payment_confirmation:
        this.configService.get('NOTIFICATION_COLOR_PAYMENT_CONFIRMATION') ||
        DEFAULT_NOTIFICATION_CONFIG.colors.payment_confirmation,
      negative_balance:
        this.configService.get('NOTIFICATION_COLOR_NEGATIVE_BALANCE') ||
        DEFAULT_NOTIFICATION_CONFIG.colors.negative_balance,
    };

    /* Initialisation des types de notification */
    this.notificationTypes =
      this.configService
        .get<string>('NOTIFICATION_TYPES')
        ?.split(',')
        .map((type) => type.trim()) || DEFAULT_NOTIFICATION_CONFIG.types;
  }

  async createNotification(
    userId: string,
    title: string,
    message: string,
    notif_type: string,
    data?: object,
  ) {
    if (!isValidObjectId(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

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
    if (!isValidObjectId(notificationId)) {
      throw new BadRequestException('Invalid notification ID format');
    }

    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { is_read: true },
      { new: true },
    );
  }

  async getUserNotifications(userId: string) {
    if (!isValidObjectId(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    return await this.notificationModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ created_at: -1 })
      .exec();
  }

  async getUnreadNotifications(userId: string) {
    if (!isValidObjectId(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

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
    if (!isValidObjectId(notificationId)) {
      throw new BadRequestException('Invalid notification ID format');
    }

    return this.notificationModel.findByIdAndDelete(notificationId);
  }
}
