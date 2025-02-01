import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentStatus } from '../Schemas/payment/payment.schema';
import { Model, Types } from 'mongoose';
import { Counter } from '../Schemas/counter_schema/counter.schema';
import { NotificationService } from '../notifications/notification.service';
import { Config } from '../Schemas/config_schema/config.schema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
    @InjectModel(Config.name) private configModel: Model<Config>,
    private notificationService: NotificationService,
  ) {}

  /*async processPayment(zemId: string, createPaymentDto: CreatePaymentDto) {
    const counter = await this.counterModel.findOne({
      zem: new Types.ObjectId(zemId),
    });

    if (!counter) {
      throw new NotFoundException('Counter not found for this Zem');
    }

    // Calcule du nombre de kilometre à rechager
    const price_per_km = await this.configModel.findOne({ key: "1km-price" });
    const counter_min_km = await this.configModel.findOne({ key: "min-km" });
    const km_amount = Math.ceil(createPaymentDto.price_per_km / price_per_km.value);

    // Simulation du traitement du paiement avec un service externe
    const transactionId = `TR-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const payment = new this.paymentModel({
      counter: counter._id,
      zem: new Types.ObjectId(zemId),
      km_amount: km_amount,
      price_per_km: createPaymentDto.price_per_km,
      payment_method: createPaymentDto.payment_method,
      transaction_id: transactionId,
      status: PaymentStatus.COMPLETED,
    });

    try {
      const savedPayment = await payment.save();

      // mise a jour du solde du compteur en km
      counter.balance_km += km_amount;
      counter.is_low_balance = counter.balance_km < counter_min_km.value; // seuil en km
      await counter.save();

      //Envoyer une notification de confirmation
      await this.notificationService.sendPaymentConfirmation(zemId, createPaymentDto.price_per_km);

      return {
        payment: savedPayment,
        new_km_balance: counter.balance_km,
      }
    } catch (e) {
      throw new BadRequestException(`Payment failed: ${e.message}`);
    }
  }*/

  async getPaymentHistory(zemId: string) {
    const payments = await this.paymentModel
      .find({
        zem: new Types.ObjectId(zemId),
      })
      .sort({ createdAt: -1 })
      .exec();

    return payments;
  }

  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
