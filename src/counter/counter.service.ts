import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCounterDto } from './dto/create-counter.dto';
import { UpdateCounterDto } from './dto/update-counter.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Counter } from '../Schemas/counter_schema/counter.schema';
import { Model, Types } from 'mongoose';
import { Payment, PaymentStatus } from '../Schemas/payment/payment.schema';
import { Zems } from '../Schemas/zems_schema/Zems.schema';
import { CoursesStatus, Races } from '../Schemas/races_schema/races.schema';
import { NotificationService } from '../services/notification.service';
import { CreatePaymentDto } from '../payment/dto/create-payment.dto';
import { DeductKilometersDto } from '../payment/dto/deduct-kilometers.dto';
import { Config } from '../Schemas/config_schema/config.schema';
import { response } from 'express';

@Injectable()
export class CounterService {

  constructor(
    @InjectModel(Counter.name) private readonly counterModel: Model<Counter>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(Zems.name) private readonly zemsModel: Model<Zems>,
    @InjectModel(Races.name) private racesModel: Model<Races>,
    @InjectModel(Config.name) private configModel: Model<Config>,
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

    const free_km = await this.configModel.findOne({ key: 'free-km' }).exec();

    const counter = new this.counterModel({
      zem: new Types.ObjectId(zemId),
      balance_km: parseFloat(free_km.value),
      price_per_km: 0,
      total_km_traveled: 0,
    });

    return counter.save();
  }

  async getCounterByZemId(zemId: string) {

    console.log('Searching for counter with zemId:', zemId);

    if (!Types.ObjectId.isValid(zemId)) {

      throw new BadRequestException('Format d\'ID Zem invalide');

    }

    // Vérifier d'abord si le Zem existe

    const zem = await this.zemsModel.findById(zemId);

    if (!zem) {

      throw new NotFoundException('Zem non trouvé');

    }

    // Vérifier si le Zem est validé

    if (zem.profile_validation_status !== 'validated') {

      throw new BadRequestException('Le profil du Zem n\'est pas encore validé');

    }

    // Trouver le compteur associé au Zem

    const counter = await this.counterModel.findOne({ zem: new Types.ObjectId(zemId) })

      .populate('zem', ['number_plate', 'card_number', 'profile_validation_status'])

      .lean()

      .exec();

    console.log('Found Counter:', counter);

    if (!counter) {

      throw new NotFoundException('Aucun compteur trouvé pour ce Zem');

    }

    // Calculer les statistiques supplémentaires

    const kmMin = await this.configModel.findOne({ key: "min-km" }).exec();

    const minKmValue = kmMin ? parseFloat(kmMin.value) : 0;

    return {

      counter_id: counter._id,

      zem_info: counter.zem,

      current_balance_km: counter.balance_km,

      total_km_traveled: counter.total_km_traveled,

      is_low_balance: counter.balance_km < minKmValue,

      min_balance_threshold: minKmValue,

      status: {

        has_debt: counter.balance_km < 0,

        debt_amount: counter.balance_km < 0 ? Math.abs(counter.balance_km) : 0,

        can_start_new_race: counter.balance_km >= 0

      },

      last_updated_at: counter.updated_at

    };

  }


  async rechargeCounter(zemId: string, createPaymentDto: CreatePaymentDto) {

    const counter = await this.counterModel.findOne({
      zem: new Types.ObjectId(zemId),
    });

    if (!counter) {
      throw new NotFoundException('Aucun compteur trouvé pour ce Zem');
    }


    const price_per_km = await this.configModel.findOne({ key: "km-price" }).exec();

    const counter_min_km = await this.configModel.findOne({ key: "min-km" }).exec();

    // Calcule du nombre de kilometre à rechager
    const km_amount = Math.ceil(createPaymentDto.price_per_km / parseFloat(price_per_km.value));

    // Générer un ID unique de transaction
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

      // Si le solde est négatif, une partie du nouveau montant servira à le rembourser
      let new_balance;
      if (counter.balance_km < 0) {
        const previous_debt = counter.balance_km; // c'est négatif
        new_balance = previous_debt + km_amount; // rembourser d'abord la dette

        // Notifier l'utilisateur du remboursement
        if (new_balance >= 0) {
          await this.notificationService.sendDebtSettledAlert(zemId, Math.abs(previous_debt));
        } else {
          await this.notificationService.sendPartialDebtSettledAlert(zemId, km_amount, Math.abs(new_balance));
        }
      } else {
        new_balance = counter.balance_km + km_amount;
      }

      counter.balance_km = new_balance;
      counter.is_low_balance = new_balance < counter_min_km; // seuil en km
      await counter.save();

      await this.notificationService.sendPaymentConfirmation(zemId, createPaymentDto.price_per_km);

      return {
        payment: savedPayment,
        new_km_balance: new_balance,
        previous_debt: counter.balance_km < 0 ? Math.abs(counter.balance_km) : 0,
        remaining_debt: new_balance < 0 ? Math.abs(new_balance) : 0,
      }
    } catch (e) {
      throw new BadRequestException(`Paiement échoué: ${e.message}`);
    }

  }


  async deductKilometers(zemId: string, deductKilometersDto: DeductKilometersDto) {
    const counter = await this.counterModel.findOne({ zem: new Types.ObjectId(zemId)});
    if (!counter) {
      throw new NotFoundException('Aucun compteur trouvé pour ce Zem');
    }

    const race = await this.racesModel.findById(deductKilometersDto.race_id);
    if (!race) {
      throw new NotFoundException('Course non trouvée');
    }


    if (counter.balance_km < deductKilometersDto.kilometers) {
      throw new BadRequestException('Balance en kilometre insuffisante');
    }

    counter.balance_km -= deductKilometersDto.kilometers;
    counter.total_km_traveled += deductKilometersDto.kilometers;
    const kmMin = await this.configModel.findOne({ key: "min-km"}).exec();
    counter.is_low_balance = counter.balance_km < parseFloat(kmMin.value);

    if (counter.is_low_balance) {
      await this.notificationService.sendLowBalanceAlert(zemId, counter.balance_km);
    }

    if (counter.balance_km < 0) {
      await this.notificationService.sendNegativeBalanceAlert(zemId, counter.balance_km);
    }

    await counter.save();

    // Mise à jour du statut de la course

    race.status = CoursesStatus.END;
    race.ended_at = new Date();
    await race.save();
    return {
      counter: {
        _id: counter._id,
        current_balance: counter.balance_km,
        total_km_traveled: counter.total_km_traveled,
        is_low_balance: counter.is_low_balance
      },
      race: {
        _id: race._id,
        longitude_start: race.longitude_start,
        latitude_start: race.latitude_start,
        longitude_end: race.longitude_end,
        latitude_end: race.latitude_end,
        reference: race.reference,
        service_km: race.service_km,
        status: race.status,
        start_time: race.started_at,
        end_time: race.ended_at,
      },
      kilometers_deducted: deductKilometersDto.kilometers
    };

  }

/*  async getBalanceAfterCourse(zemId: string, raceId: string) {
    const counter = await this.counterModel.findOne({ zem: new Types.ObjectId(zemId) });
    if (!counter) {
      throw new NotFoundException('Aucun compteur trouvé pour ce Zem');
    }

    const race = await this.racesModel.findById(raceId);
    if (!race) {
      throw new NotFoundException('La course n\'est pas terminée');
    }

    return {
      initialBalance: counter.balance_km + race.distance_traveled,
      distanceTraveled: race.distance_traveled,
      remainingBalance: counter.balance_km,
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
  }*/

  async getTotalKilometers(zemId: string) {
    const counter = await this.counterModel.findOne({ zem: new Types.ObjectId(zemId) });
    if (!counter) {
      throw new NotFoundException('Aucun compteur trrouvé pour ce Zem');
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
