import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCounterHistoryDto } from './dto/create-counter-history.dto';
import { UpdateCounterHistoryDto } from './dto/update-counter-history.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Counter } from '../Schemas/counter_schema/counter.schema';
import { Payment } from '../Schemas/payment/payment.schema';
import { CoursesStatus, Races } from '../Schemas/races_schema/races.schema';
import { Race } from '../races/entities/race.entity';
import {CounterHistory} from "../Schemas/counter-history_schema/counter_history.schema";

@Injectable()
export class CounterHistoryService {
  constructor(
    @InjectModel(Counter.name) private readonly counterModel: Model<Counter>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(Races.name) private readonly raceModel: Model<Races>,
    @InjectModel(CounterHistory.name) private readonly counterHistoryModel: Model<CounterHistory>,
  ) {}

  async getCounterHistory(zemId: string) {
    const counter = await this.counterModel.findOne({
      zem: new Types.ObjectId(zemId),
    });
    if (!counter) {
      throw new NotFoundException('Aucun compteur trouvé pour ce Zem');
    }

    const histories = await this.counterHistoryModel
      .find({ counter: counter._id })
      .sort({ created_at: -1 })
      .lean()
      .exec();


    return {
      currentBalance: counter.balance_km,
      totalKmTraveled: counter.total_km_traveled,
      histories: histories,
      statistics: {
        total_recharges: histories.length,
      },
    };
  }

  create(payload) {
    const created = new this.counterHistoryModel(payload);
    return created.save();
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
