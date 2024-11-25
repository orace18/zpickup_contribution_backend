import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from '../Schemas/payment/payment.schema';
import { Counter, CounterSchema } from '../Schemas/counter_schema/counter.schema';
import { NotificationService } from '../services/notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Counter.name, schema: CounterSchema },
    ])
  ],
  controllers: [PaymentController],
  providers: [PaymentService, NotificationService],
  exports: [PaymentService]
})
export class PaymentModule {}
