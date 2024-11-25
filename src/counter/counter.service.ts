import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCounterDto } from './dto/create-counter.dto';
import { UpdateCounterDto } from './dto/update-counter.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Counter } from '../Schemas/counter_schema/counter.schema';
import { Model, Types } from 'mongoose';
import { Payment, PaymentStatus } from '../Schemas/payment/payment.schema';
import { Zems } from '../Schemas/zems_schema/Zems.schema';
import { Races } from '../Schemas/races_schema/races.schema';
import { NotificationService } from '../services/notification.service';
import { CreatePaymentDto } from '../payment/dto/create-payment.dto';
import { DeductKilometersDto } from '../payment/dto/deduct-kilometers.dto';

@Injectable()
export class CounterService {

  constructor(
    @InjectModel(Counter.name) private readonly counterModel: Model<Counter>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(Zems.name) private readonly zemsModel: Model<Zems>,
    @InjectModel(Races.name) private racesModel: Model<Races>,
    private notificationService: NotificationService,
  ) {}


  async createCounter(zemId: string) {
    const zem = await this.zemsModel.findById(zemId);
    if (!zem) {
      throw new NotFoundException('Zem not found');
    }

    if (zem.profile_validation_status !== 'validated') {
      throw new BadRequestException('Zem profile must be validated to create a counter');
    }

    const existingCounter = await this.counterModel.findOne({ zem: new Types.ObjectId(zemId) });
    if (existingCounter) {
      throw new BadRequestException('Counter already exists for this Zem');
    }

    const counter = new this.counterModel({
      zem: new Types.ObjectId(zemId),
      balance: 0,
      price_per_km: 0,
      total_km_traveled: 0,
    });

    return counter.save();
  }

  async rechargeCounter(zemId: string, createPaymentDto: CreatePaymentDto) {

    const counter = await this.counterModel.findOne({

      zem: new Types.ObjectId(zemId)

    });

    if (!counter) {

      throw new NotFoundException('Counter not found for this Zem');

    }

    // Générer un ID de transaction unique

    const transactionId = `TR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const payment = new this.paymentModel({
      counter: counter._id,

      zem: new Types.ObjectId(zemId),

      amount: createPaymentDto.amount,

      payment_method: createPaymentDto.payment_method,

      transaction_id: transactionId,

      status: PaymentStatus.COMPLETED,
    });

    try {

      const savedPayment = await payment.save();

      // Mettre à jour le solde du compteur

      counter.balance += createPaymentDto.amount;

      counter.is_low_balance = counter.balance < 1000;

      await counter.save();

      // Envoyer une notification de confirmation

      await this.notificationService.sendPaymentConfirmation(zemId, createPaymentDto.amount);

      return {

        payment: savedPayment,

        newBalance: counter.balance

      };

    } catch (error) {

      throw new BadRequestException(`Payment failed: ${error.message}`);

    }

  }


  async deductKilometers(zemId: string, deductKilometersDto: DeductKilometersDto) {
    const counter = await this.counterModel.findOne({ zem: new Types.ObjectId(zemId)});
    if (!counter) {
      throw new NotFoundException('Counter not found for this Zem');
    }

    if (counter.balance < deductKilometersDto.kilometers) {
      throw new BadRequestException('Insufficient balance');
    }

    counter.balance -= deductKilometersDto.kilometers;
    counter.total_km_traveled += deductKilometersDto.kilometers;
    counter.is_low_balance = counter.balance < 1000;

    if (counter.is_low_balance) {
      await this.notificationService.sendLowBalanceAlert(zemId, counter.balance);
    }

    return counter.save();
  }

  async getCounterHistory(zemId: string) {
    const counter = await this.counterModel.findOne({ zem: new Types.ObjectId(zemId)  });
    if (!counter) {
      throw new NotFoundException('Counter not found for this zem');
    }

    const recharges = await this.paymentModel.find({ counter: counter._id })
      .sort({ createdAt: -1 })
      .exec();

    return {
      currentBalance: counter.balance,
      totalKmTraveled: counter.total_km_traveled,
      rechargeHistory: recharges,
    };
  }

  async getBalanceAfterCourse(zemId: string, raceId: string) {
    const counter = await this.counterModel.findOne({ zem: new Types.ObjectId(zemId) });
    if (!counter) {
      throw new NotFoundException('Counter not found for this Zem');
    }

    const race = await this.racesModel.findById(raceId);
    if (!race) {
      throw new NotFoundException('Race is not completed yet');
    }

    return {
      initialBalance: counter.balance + race.distance_traveled,
      distanceTraveled: race.distance_traveled,
      remainingBalance: counter.balance,
      raceDetails: {
        startLocation: {
          latitude: race.latitude_start,
          longitude: race.longitude_start,
        },
        endLocation: {
          latitude: race.latitude_end,
          longitude: race.longitude_end,
        },
        startTime: race.started_at,
        endTime: race.ended_at,
      }
    }
  }

  async getTotalKilometers(zemId: string) {
    const counter = await this.counterModel.findOne({ zem: new Types.ObjectId(zemId) });
    if (!counter) {
      throw new NotFoundException('Counter not found for this Zem');
    }

    const completedRaces = await this.racesModel.find({
      zem: new Types.ObjectId(zemId),
      status: 'end',
    });

    const totalKmByRaces = completedRaces.reduce((total, race) => total + (race.distance_traveled || 0), 0)

    return {
      totalKilometersTraveled: counter.total_km_traveled,
      totalCompletedRaces: completedRaces.length,
      averageKilometersPerRace: completedRaces.length > 0 ? totalKmByRaces / completedRaces.length : 0,
      lastRace: completedRaces[0] || null,
    }
  }

  findAll() {
    return `This action returns all counter`;
  }

  findOne(id: number) {
    return `This action returns a #${id} counter`;
  }

  update(id: number, updateCounterDto: UpdateCounterDto) {
    return `This action updates a #${id} counter`;
  }

  remove(id: number) {
    return `This action removes a #${id} counter`;
  }
}
