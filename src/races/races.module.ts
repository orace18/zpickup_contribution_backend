import { forwardRef, Module } from '@nestjs/common';
import { RacesService } from './races.service';
import { RacesController } from './races.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Zems, ZemsSchema} from "../Schemas/zems_schema/Zems.schema";
import {Races, RacesSchema} from "../Schemas/races_schema/races.schema";
import {Users, UserSchema} from "../Schemas/users_schema/Users.schema";
import {UsersService} from "../users/users.service";
import {Config, ConfigSchema} from "../Schemas/config_schema/config.schema";
import {ZemsService} from "../zems/zems.service";
import { WebsocketModule } from '../websocket/websocket.module';
import { WalletModule } from '../wallet/wallet.module';
import {NotificationSchema, Notification} from "../Schemas/notifications_schema/notifications.schema";
import {NotificationService} from "../notifications/notification.service";
import {Counter, CounterSchema} from "../Schemas/counter_schema/counter.schema";
import {CounterService} from "../counter/counter.service";
import {Payment, PaymentSchema} from "../Schemas/payment/payment.schema";
import {CounterHistoryService} from "../counter-history/counter-history.service";
import {CounterHistory, CounterHistorySchema} from "../Schemas/counter-history_schema/counter_history.schema";
import { ReferenceHistoryModule } from 'src/reference_history/reference_history.module';
import {RaceHistoryModule} from "../race_history/race_history.module";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Races.name, schema: RacesSchema }]),
    UsersModule,
    MongooseModule.forFeature([{ name: Zems.name, schema: ZemsSchema }]),
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    MongooseModule.forFeature([{ name: Counter.name, schema: CounterSchema }]),
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    MongooseModule.forFeature([{ name: CounterHistory.name, schema: CounterHistorySchema }]),
    WebsocketModule,
    WalletModule,
    forwardRef(() => ReferenceHistoryModule),
  ],

  controllers: [RacesController],
  providers: [RacesService, ZemsService,NotificationService,CounterService,CounterHistoryService],
})
export class RacesModule {}
