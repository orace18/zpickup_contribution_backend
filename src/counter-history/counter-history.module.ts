import { Module } from '@nestjs/common';
import { CounterHistoryService } from './counter-history.service';
import { CounterHistoryController } from './counter-history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Counter,
  CounterSchema,
} from '../Schemas/counter_schema/counter.schema';
import { Payment, PaymentSchema } from '../Schemas/payment/payment.schema';
import { Races, RacesSchema } from '../Schemas/races_schema/races.schema';
import { NotificationService } from '../notifications/notification.service';
import { NotificationsModule } from '../notifications/notifications.module';
import {CounterHistory, CounterHistorySchema} from "../Schemas/counter-history_schema/counter_history.schema";

@Module({
  imports: [
    NotificationsModule,
    MongooseModule.forFeature([
      {
        name: Counter.name,
        schema: CounterSchema,
      },
      { name: Payment.name, schema: PaymentSchema },
      { name: Races.name, schema: RacesSchema },
      { name: CounterHistory.name, schema: CounterHistorySchema },
    ]),
  ],
  controllers: [CounterHistoryController],
  providers: [CounterHistoryService],
  exports: [CounterHistoryService],
})
export class CounterHistoryModule {}
