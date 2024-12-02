import { Module } from '@nestjs/common';
import { CounterHistoryService } from './counter-history.service';
import { CounterHistoryController } from './counter-history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CounterHistory,
  CounterHistorySchema,
} from '../Schemas/counter-history_schema/counter_history.schema';
import {
  Counter,
  CounterSchema,
} from '../Schemas/counter_schema/counter.schema';
import { Payment, PaymentSchema } from '../Schemas/payment/payment.schema';
import { Races, RacesSchema } from '../Schemas/races_schema/races.schema';
import { NotificationService } from '../services/notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CounterHistory.name, schema: CounterHistorySchema },
      {
        name: Counter.name,
        schema: CounterSchema,
      },
      { name: Payment.name, schema: PaymentSchema },
      { name: Races.name, schema: RacesSchema }
    ]),
  ],
  controllers: [CounterHistoryController],
  providers: [CounterHistoryService, NotificationService],
  exports: [CounterHistoryService],
})
export class CounterHistoryModule {}
