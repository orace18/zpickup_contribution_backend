import { forwardRef, Module } from '@nestjs/common';
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
import {CounterHistoryService} from "../counter-history/counter-history.service";
import {CounterHistory, CounterHistorySchema} from "../Schemas/counter-history_schema/counter_history.schema";
import {WalletModule} from "../wallet/wallet.module";
import { ReferenceHistory, ReferenceHistorySchema } from 'src/Schemas/reference_history_schema/reference_history_schema.schema';
import { ReferenceHistoryModule } from 'src/reference_history/reference_history.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Counter.name, schema: CounterSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Zems.name, schema: ZemsSchema },
      { name: Races.name, schema: RacesSchema },
      { name: Config.name, schema: ConfigSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: CounterHistory.name, schema: CounterHistorySchema },
    ],
    ),
    forwardRef(() => WalletModule),
    forwardRef(() => ReferenceHistoryModule),
    forwardRef(() => UsersModule), // Ajout de cette ligne
  ],
  controllers: [CounterController],
  providers: [CounterService, NotificationService,CounterHistoryService],
  exports: [CounterService, MongooseModule],
})
export class CounterModule {}
