import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCounterHistoryDto } from './dto/create-counter-history.dto';
import { UpdateCounterHistoryDto } from './dto/update-counter-history.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Counter } from '../Schemas/counter_schema/counter.schema';
import { Payment } from '../Schemas/payment/payment.schema';

@Injectable()
export class CounterHistoryService {

  constructor(
    @InjectModel(Counter.name) private readonly counterModel: Model<Counter>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
  ) {}

  async getCounterHistory(zemId: string) {
    const counter = await this.counterModel.findOne({ zem: new Types.ObjectId(zemId)  });
    if (!counter) {
      throw new NotFoundException('Aucun compteur trouvé pour ce Zem');
    }

    const recharges = await this.paymentModel.find({ counter: counter._id })
      .sort({ createdAt: -1 })
      .exec();

    return {
      currentBalance: counter.balance_km,
      totalKmTraveled: counter.total_km_traveled,
      rechargeHistory: recharges,
    };
  }

  create(createCounterHistoryDto: CreateCounterHistoryDto) {
    return 'This action adds a new counterHistory';
  }

  findAll() {
    return `This action returns all counterHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} counterHistory`;
  }

  update(id: number, updateCounterHistoryDto: UpdateCounterHistoryDto) {
    return `This action updates a #${id} counterHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} counterHistory`;
  }
}
