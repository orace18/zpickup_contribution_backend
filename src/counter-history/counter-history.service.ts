import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCounterHistoryDto } from './dto/create-counter-history.dto';
import { UpdateCounterHistoryDto } from './dto/update-counter-history.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Counter } from '../Schemas/counter_schema/counter.schema';
import { Payment } from '../Schemas/payment/payment.schema';
import { CoursesStatus, Races } from '../Schemas/races_schema/races.schema';
import { Race } from '../races/entities/race.entity';
import { CounterHistory } from "../Schemas/counter-history_schema/counter_history.schema";
import { AbsKmHistory } from 'src/Schemas/abs_km_history/abs_km_history.schema';

@Injectable()
export class CounterHistoryService {
  constructor(
    @InjectModel(Counter.name) private readonly counterModel: Model<Counter>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(Races.name) private readonly raceModel: Model<Races>,
    @InjectModel(CounterHistory.name) private readonly counterHistoryModel: Model<CounterHistory>,
    @InjectModel(AbsKmHistory.name) private readonly absKmHistoryModel: Model<AbsKmHistory>,
  ) { }

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

    const ambassadorHistories = await this.absKmHistoryModel
      .find({ zem: zemId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

      const formattedAmbassadorHistories = ambassadorHistories.map(history => ({
        _id: history._id,
        counter: counter._id,
        value: history.kmAdded,
        counter_type: 'input',
        reference: 'Km gratuit du mois',
        description: history.description || 'Ajout manuel de kilomètres',
        created_at: history.created_at || new Date(),
        updated_at: history.updated_at || new Date(),
        __v: 0
      }));
  

    const allHistories = [...histories, ...formattedAmbassadorHistories]
    .sort((a, b) => {
      const dateA = new Date(a.created_at || a.created_at);
      const dateB = new Date(b.created_at || b.created_at);
      return dateB.getTime() - dateA.getTime();
    });


    return {
      currentBalance: counter.balance_km,
      totalKmTraveled: counter.total_km_traveled,
      histories: allHistories,
      statistics: {
        total_recharges: histories.length,
        total_ambassador_recharges: ambassadorHistories.length,
        total_all_recharges: histories.length + ambassadorHistories.length
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
