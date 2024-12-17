import { Module } from '@nestjs/common';
import { CounterService } from './counter.service';
import { CounterController } from './counter.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Counter,
  CounterSchema,
} from '../Schemas/counter_schema/counter.schema';
import { Payment, PaymentSchema } from '../Schemas/payment/payment.schema';
import { Zems, ZemsSchema } from '../Schemas/zems_schema/Zems.schema';
import { Races, RacesSchema } from '../Schemas/races_schema/races.schema';
import { NotificationService } from '../notifications/notification.service';
import { Config, ConfigSchema } from '../Schemas/config_schema/config.schema';
import {
  Notification,
  NotificationSchema,
} from '../Schemas/notifications_schema/notifications.schema';
import { Users, UserSchema } from '../Schemas/users_schema/Users.schema';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Counter.name, schema: CounterSchema },
      { name: Users.name, schema: UserSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Zems.name, schema: ZemsSchema },
      { name: Races.name, schema: RacesSchema },
      { name: Config.name, schema: ConfigSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [CounterController],
  providers: [CounterService, NotificationService, UsersService],
  exports: [CounterService],
})
export class CounterModule {}
