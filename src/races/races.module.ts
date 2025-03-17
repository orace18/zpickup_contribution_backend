import { forwardRef, Module } from '@nestjs/common';
import { RacesService } from './races.service';
import { RacesController } from './races.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Zems, ZemsSchema } from "../Schemas/zems_schema/Zems.schema";
import { Races, RacesSchema } from "../Schemas/races_schema/races.schema";
import { Users, UsersSchema } from "../Schemas/users_schema/Users.schema";
import { Config, ConfigSchema } from "../Schemas/config_schema/config.schema";
import { WebsocketModule } from '../websocket/websocket.module';
import { WalletModule } from '../wallet/wallet.module';
import { NotificationSchema, Notification } from "../Schemas/notifications_schema/notifications.schema";
import { Counter, CounterSchema } from "../Schemas/counter_schema/counter.schema";
import { Payment, PaymentSchema } from "../Schemas/payment/payment.schema";
import { CounterHistory, CounterHistorySchema } from "../Schemas/counter-history_schema/counter_history.schema";
import { ReferenceHistoryModule } from 'src/reference_history/reference_history.module';
import { UsersModule } from "../users/users.module";
import { ZemsModule } from "../zems/zems.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { CounterModule } from "../counter/counter.module";


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Races.name, schema: RacesSchema },
      { name: Users.name, schema: UsersSchema },
      { name: Zems.name, schema: ZemsSchema },
      { name: Config.name, schema: ConfigSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: Counter.name, schema: CounterSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: CounterHistory.name, schema: CounterHistorySchema }
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => ZemsModule),
    forwardRef(() => WalletModule),
    forwardRef(() => ReferenceHistoryModule),
    NotificationsModule,
    CounterModule,
    WebsocketModule
  ],
  controllers: [RacesController],
  providers: [RacesService],
  exports: [RacesService]
})
export class RacesModule {}