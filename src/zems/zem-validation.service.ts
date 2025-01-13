// src/zems/services/zem-validation.service.ts
import { Injectable } from '@nestjs/common';
import { ZemsService } from './zems.service';
import { CounterService } from '../counter/counter.service';
import { UsersService } from '../users/users.service';
import { NotificationService } from '../notifications/notification.service';
import { ProfileValidationStatus } from '../Schemas/zems_schema/Zems.schema';
import {sendNotification} from "../services/helpers.service";

@Injectable()
export class ZemValidationService {
  constructor(
    private readonly zemsService: ZemsService,
    private readonly counterService: CounterService,
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService,
    private readonly userService: UsersService,
  ) {}

  async validateZem(zemId: string) {
    const updatedZem = await this.zemsService.update(zemId, {
      profile_validation_status: ProfileValidationStatus.VALIDATED,
      validated_at: new Date(),
    });
    const counter = await this.counterService.createCounter(zemId);
    const zem =  await this.zemsService.findOne(zemId);
    //send notification

    let user = await this.userService.findOne(zem.user.toString());
    let body_notification = 'Votre compte conducteur a été validé';
    let more_action = '';
    if (user.fcm_token) {
      const send_data = {
        more_action: more_action,
      };
      sendNotification('Course', body_notification, user.fcm_token, send_data);
    }


    return {
      zem: updatedZem,
      counter: counter,
    };
  }
}
