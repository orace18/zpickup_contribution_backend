import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCounterHistoryDto } from './dto/create-counter-history.dto';
import { UpdateCounterHistoryDto } from './dto/update-counter-history.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Counter } from '../Schemas/counter_schema/counter.schema';
import { Payment } from '../Schemas/payment/payment.schema';
import { CoursesStatus, Races } from '../Schemas/races_schema/races.schema';
import { Race } from '../races/entities/race.entity';

@Injectable()
export class CounterHistoryService {
  constructor(
    @InjectModel(Counter.name) private readonly counterModel: Model<Counter>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(Races.name) private readonly raceModel: Model<Races>,
  ) {}

  async getCounterHistory(zemId: string) {
    const counter = await this.counterModel.findOne({
      zem: new Types.ObjectId(zemId),
    });
    if (!counter) {
      throw new NotFoundException('Aucun compteur trouvé pour ce Zem');
    }

    const recharges = await this.paymentModel
      .find({ counter: counter._id })
      .sort({ created_at: -1 })
      .lean()
      .exec();

    const races = await this.raceModel
      .find({
        zem: new Types.ObjectId(zemId),
        status: CoursesStatus.END,
      })
      .sort({ ended_at: -1 })
      .lean()
      .exec();

    const formattedRaces = races.map((race) => ({
      _id: race._id,
      reference: race.reference,
      start_location: {
        longitude: race.longitude_start,
        latitude: race.latitude_start,
        started_at: race.started_at,
      },
      end_location: {
        longitude: race.longitude_end,
        latitude: race.latitude_end,
        ended_at: race.ended_at,
      },
      service_km: Number(race.distance_traveled?.toFixed(2)) || 0,
      status: race.status,
      created_at: race.created_at,
      updated_at: race.updated_at,
    }));

    return {
      currentBalance: counter.balance_km,
      totalKmTraveled: counter.total_km_traveled,
      rechargeHistory: recharges,
      raceHistory: formattedRaces,
      statistics: {
        total_recharges: recharges.length,
        total_races: races.length,
      },
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
