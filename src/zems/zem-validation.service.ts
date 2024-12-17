// src/zems/services/zem-validation.service.ts
import { Injectable } from '@nestjs/common';
import { ZemsService } from './zems.service';
import { CounterService } from '../counter/counter.service';
import { UsersService } from '../users/users.service';
import { NotificationService } from '../notifications/notification.service';
import { ProfileValidationStatus } from '../Schemas/zems_schema/Zems.schema';

@Injectable()
export class ZemValidationService {
  constructor(
    private readonly zemsService: ZemsService,
    private readonly counterService: CounterService,
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService,
  ) {}

  async validateZem(zemId: string) {
    // Mettre à jour le statut de validation
    const updatedZem = await this.zemsService.update(zemId, {
      profile_validation_status: ProfileValidationStatus.VALIDATED,
      validated_at: new Date(),
    });

    const counter = await this.counterService.createCounter(zemId);

    return {
      zem: updatedZem,
      counter: counter,
    };
  }
}
