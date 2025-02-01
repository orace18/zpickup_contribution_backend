import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from '../Schemas/payment/payment.schema';
import {
  Counter,
  CounterSchema,
} from '../Schemas/counter_schema/counter.schema';
import { Config, ConfigSchema } from '../Schemas/config_schema/config.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    NotificationsModule,
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Counter.name, schema: CounterSchema },
      { name: Config.name, schema: ConfigSchema },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
