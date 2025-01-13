import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('test')
  async testNotification(
    @Body()
    notificationData: {
      userId: string;
      title: string;
      message: string;
      notif_type: string;
      data?: object;
    },
  ) {
    return await this.notificationService.createNotification(
      notificationData.userId,
      notificationData.title,
      notificationData.message,
      notificationData.notif_type,
      notificationData.data,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async getUserNotifications(@Param('userId') userId: string) {
    return await this.notificationService.getUserNotifications(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('read/:id')
  async markAsRead(@Param('id') id: string) {
    return await this.notificationService.markAsRead(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    return await this.notificationService.deleteNotification(id);
  }
}
