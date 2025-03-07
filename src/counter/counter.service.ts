import {BadRequestException, Injectable, NotFoundException,} from '@nestjs/common';
import {UpdateCounterDto} from './dto/update-counter.dto';
import {InjectModel} from '@nestjs/mongoose';
import {Counter} from '../Schemas/counter_schema/counter.schema';
import {HydratedDocument, Model, Types} from 'mongoose';
import {Payment, PaymentStatus} from '../Schemas/payment/payment.schema';
import {Zems} from '../Schemas/zems_schema/Zems.schema';
import {CoursesStatus, Races} from '../Schemas/races_schema/races.schema';
import {NotificationService} from '../notifications/notification.service';
import {CreatePaymentDto} from '../payment/dto/create-payment.dto';
import {DeductKilometersDto} from '../payment/dto/deduct-kilometers.dto';
import {Config} from '../Schemas/config_schema/config.schema';
import {UsersService} from '../users/users.service';
import {sendNotification} from '../services/helpers.service';
import {CounterType} from "../Schemas/counter-history_schema/counter_history.schema";
import {CounterHistoryService} from "../counter-history/counter-history.service";
import {Users} from "../Schemas/users_schema/Users.schema";

@Injectable()
export class CounterService {
  constructor(
    @InjectModel(Counter.name) private readonly counterModel: Model<Counter>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(Zems.name) private readonly zemsModel: Model<Zems>,
    @InjectModel(Races.name) private racesModel: Model<Races>,
    @InjectModel(Config.name) private configModel: Model<Config>,
    private notificationService: NotificationService,
    private readonly userService: UsersService,
    private readonly counterHistoryService: CounterHistoryService,
  ) {}

  async createCounter(zemId: string) {
    const zem = await this.zemsModel.findById(zemId);
    if (!zem) {
      throw new NotFoundException('Zem not found');
    }

    if (zem.profile_validation_status !== 'validated') {
      throw new BadRequestException(
        'Zem profile must be validated to create a counter',
      );
    }

    let existingCounter = await this.counterModel.findOne({
      zem: new Types.ObjectId(zemId),
    });
    const free_km = await this.configModel.findOne({ key: 'free-km' }).exec();
    const km_kdo_for_zem = await this.configModel.findOne({ key: 'km-kdo-for-zem' }).exec();

    if (!existingCounter) {

      const counter = new this.counterModel({
        zem: new Types.ObjectId(zemId),
        balance_km: parseFloat(free_km.value),
        price_per_km: 0,
        total_km_traveled: 0,
      });

      existingCounter = await counter.save();
    }

    if(existingCounter && parseInt(km_kdo_for_zem.value)==1){
      await this.counterHistoryService.create({counter: existingCounter._id, counter_type:CounterType.INPUT,value:parseFloat(free_km.value), reference: `Km kdo de bienvenu`});
    }


    return zem;
  }

  async getCounterByZemId(zemId: string) {
    console.log('Searching for counter with zemId:', zemId);

    if (!Types.ObjectId.isValid(zemId)) {
      throw new BadRequestException("Format d'ID Zem invalide");
    }

    // Vérifier d'abord si le Zem existe

    const zem = await this.zemsModel.findById(zemId);

    if (!zem) {
      throw new NotFoundException('Zem non trouvé');
    }

    // Vérifier si le Zem est validé

    if (zem.profile_validation_status !== 'validated') {
      throw new BadRequestException("Le profil du Zem n'est pas encore validé");
    }

    // Trouver le compteur associé au Zem

    const counter = await this.counterModel
      .findOne({ zem: new Types.ObjectId(zemId) })

      .populate('zem', [
        'number_plate',
        'card_number',
        'profile_validation_status',
      ])
      .lean()
      .exec();

    console.log('Found Counter:', counter);

    if (!counter) {
      throw new NotFoundException('Aucun compteur trouvé pour ce Zem');
    }

    // Calculer les statistiques supplémentaires

    const kmMin = await this.configModel.findOne({ key: 'min-km' }).exec();

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

        can_start_new_race: counter.balance_km >= 0,
      },

      last_updated_at: counter.updated_at,
    };
  }

  findOne(id: string) {
    return this.counterModel.findById(id).exec();
  }

  async rechargeCounter(zemId: string, createPaymentDto: CreatePaymentDto) {
    const counter = await this.counterModel.findOne({
      zem: new Types.ObjectId(zemId),
    });

    if (!counter) {
      throw new NotFoundException('Aucun compteur trouvé pour ce Zem');
    }

    const zem = await this.zemsModel.findById(zemId);

    const price_per_km = await this.configModel
      .findOne({ key: 'km-price' })
      .exec();

    const counter_min_km = await this.configModel
      .findOne({ key: 'min-km' })
      .exec();

    // Calcule du nombre de kilometre à rechager
    const km_amount = Math.ceil(
      createPaymentDto.price_per_km / parseFloat(price_per_km.value),
    );

    // Générer un ID unique de transaction
    const transactionId = `TR-${Date.now()}-${Math.random().toString(36).substring(2, 3)}`;

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

      /* Si le solde est négatif, une partie du nouveau montant servira à le rembourser */
      let new_balance;
      if (counter.balance_km < 0) {
        const previous_debt = counter.balance_km; /* c'est négatif */
        new_balance =
          previous_debt + km_amount; /* rembourser d'abord la dette */

        /* Notifier l'utilisateur du remboursement */
        if (new_balance >= 0) {
          await this.notificationService.createNotification(
            zem.user.toString(),
            'Dette remboursée',
            `Votre dette de ${Math.abs(previous_debt)} km a été entièrement remboursée.`,
            'debt_settled',
            { settled_amount: Math.abs(previous_debt) },
          );

          const zem_user = await this.userService.findOne(zem.user.toString());
          if (zem_user && zem_user.fcm_token) {
            const send_data = {
              _id: zem_user._id.toString(),
              more_action: 'Dette',
            };
            await sendNotification(
              'Dette remboursée',
              `Votre dette de ${Math.abs(previous_debt)} km a été entièrement remboursée.`,
              zem_user.fcm_token,
              send_data,
            );
          }
        } else {
          await this.notificationService.createNotification(
            zem.user.toString(),
            'Dette partiellement remboursée',
            `${km_amount} km de votre dette a été partiellement remboursée. Dette restante: ${Math.abs(new_balance)} km`,
            'partial_debt_settled',
            {
              settledAmount: km_amount,
              remainingDebt: Math.abs(new_balance),
            },
          );

          const zem_user = await this.userService.findOne(zem.user.toString());
          if (zem_user && zem_user.fcm_token) {
            const send_data = {
              _id: zem_user._id.toString(),
              more_action: 'Dette',
            };
            await sendNotification(
              'Dette partiellement remboursée',
              `${km_amount} km de votre dette a été partiellement remboursée. Dette restante: ${Math.abs(new_balance)} km`,
              zem_user.fcm_token,
              send_data,
            );
          }
        }
      } else {
        new_balance = counter.balance_km + km_amount;
      }

      counter.balance_km = new_balance;
      counter.is_low_balance =
        new_balance < parseFloat(counter_min_km.value); /* seuil en km */
      await counter.save();
      await this.counterHistoryService.create({counter: counter._id, counter_type:CounterType.INPUT,value:km_amount, reference: `Recharge #${transactionId}`});


      await this.notificationService.createNotification(
        zem.user.toString(),
        'Paiement Confirmé',
        `Succès! Vous avez effectué un rechargement de ${createPaymentDto.price_per_km} XOF soit ${km_amount} km`,
        'payment_confirmation',
        { balance: createPaymentDto.price_per_km },
      );

      const zem_user = await this.userService.findOne(zem.user.toString());
      if (zem_user && zem_user.fcm_token) {
        const send_data = {
          _id: zem_user._id.toString(),
          more_action: 'Paiement Confirmé',
        };
        await sendNotification(
          'Rechargement Confirmé',
          `Succès! Vous avez effectué un rechargement de ${createPaymentDto.price_per_km} XOF soit ${km_amount} km`,
          zem_user.fcm_token,
          send_data,
        );
      }

      return {
        payment: savedPayment,
        new_km_balance: new_balance,
        previous_debt:
          counter.balance_km < 0 ? Math.abs(counter.balance_km) : 0,
        remaining_debt: new_balance < 0 ? Math.abs(new_balance) : 0,
      };
    } catch (e) {
      throw new BadRequestException(`Paiement échoué: ${e.message}`);
    }
  }

  async deductKilometers(
    zemId: string,
    deductKilometersDto: DeductKilometersDto,
  ) {
    const counter = await this.counterModel.findOne({
      zem: new Types.ObjectId(zemId),
    });
    if (!counter) {
      throw new NotFoundException('Aucun compteur trouvé pour ce Zem');
    }

    const zem = await this.zemsModel.findById(zemId);

    const race = await this.racesModel.findById(deductKilometersDto.race_id);
    if (!race) {
      throw new NotFoundException('Course non trouvée');
    }

    /*if (counter.balance_km < deductKilometersDto.kilometers) {
      throw new BadRequestException('Balance en kilometre insuffisante');
    }*/

    counter.balance_km -= deductKilometersDto.kilometers;
    counter.total_km_traveled += deductKilometersDto.kilometers;
    const kmMin = await this.configModel.findOne({ key: 'min-km' }).exec();
    counter.is_low_balance = counter.balance_km < parseFloat(kmMin.value);

    if (counter.is_low_balance) {
      const title = "Kilométrage faible";
      const msg = "Veuillez recharger votre compteur pour continuer à rouler.";
      await this.notificationService.createNotification(
        zem.user.toString(), title, msg,
        'low_balance',
        { balance: counter.balance_km },
      );

      const zem_user = await this.userService.findOne(zem.user.toString());
      if (zem_user && zem_user.fcm_token) {
        const send_data = {
          _id: zem_user._id.toString(),
          more_action: 'Alerte',
        };
        await sendNotification(
          title,
          msg,
          zem_user.fcm_token,
          send_data,
        );
      }
    }

    if (counter.balance_km < 0) {
      const title = "Kilométrage faible";
      const msg = `Attention! Votre solde est négatif: ${counter.balance_km} km. Vous devrez rembourser ce montant lors de votre prochaine recharge`;
      await this.notificationService.createNotification(
        zem.user.toString(),
          title,
          msg,
        'negative_balance',
        { balance: counter.balance_km },
      );

      const zem_user = await this.userService.findOne(zem.user.toString());
      if (zem_user && zem_user.fcm_token) {
        const send_data = {
          _id: zem_user._id.toString(),
          more_action: 'Alerte',
        };
        await sendNotification(
            title, msg, zem_user.fcm_token,
          send_data,
        );
      }
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
        is_low_balance: counter.is_low_balance,
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
      kilometers_deducted: deductKilometersDto.kilometers,
    };
  }


  async debitOrCreditCounter(
    zemId: string,
    kilometers:number,
    reference:string,
    type:CounterType,
  ) {
    const counter = await this.counterModel.findOne({
      zem: new Types.ObjectId(zemId),
    });
    if (!counter) {
      throw new NotFoundException('Aucun compteur trouvé pour ce Zem');
    }

    const zem = await this.zemsModel.findById(zemId);

    switch (type){
      case CounterType.OUTPUT:
        counter.balance_km -= kilometers;
        counter.total_km_traveled += kilometers;
        break;
      case CounterType.INPUT:
        counter.balance_km += kilometers;
        break;
    }

    const kmMin = await this.configModel.findOne({ key: 'min-km' }).exec();
    counter.is_low_balance = counter.balance_km < parseFloat(kmMin.value);

    if (counter.is_low_balance) {
      const title = "Kilométrage faible";
      const msg = "Veuillez recharger votre compteur afin d'éffectuer d'autres courses";
      await this.notificationService.createNotification(
        zem.user.toString(), title, msg,
        'low_balance',
        { balance: counter.balance_km },
      );

      const zem_user = await this.userService.findOne(zem.user.toString());
      if (zem_user && zem_user.fcm_token) {
        const send_data = {
          _id: zem_user._id.toString(),
          more_action: 'Alerte',
        };
        await sendNotification(
          title,
          msg,
          zem_user.fcm_token,
          send_data,
        );
      }
    }

    if (counter.balance_km < 0) {
      const title = "Kilométrage faible";
      const msg = `Attention! Votre solde est négatif: ${counter.balance_km} km. Vous devrez rembourser ce montant lors de votre prochaine recharge`;
      await this.notificationService.createNotification(
        zem.user.toString(),
          title,
          msg,
        'negative_balance',
        { balance: counter.balance_km },
      );

      const zem_user = await this.userService.findOne(zem.user.toString());
      if (zem_user && zem_user.fcm_token) {
        const send_data = {
          _id: zem_user._id.toString(),
          more_action: 'Alerte',
        };
        await sendNotification(
            title, msg, zem_user.fcm_token,
          send_data,
        );
      }
    }

    await counter.save();

    await this.counterHistoryService.create({counter: counter._id, counter_type:type,value:kilometers, reference: reference});

    return counter;
  }

  async findByZem(zem_id: string): Promise<Counter | null> {
    return this.counterModel.findOne({ zem: new Types.ObjectId(zem_id), }).exec();
  }

  async getTotalKilometers(zemId: string) {
    const counter = await this.counterModel.findOne({
      zem: new Types.ObjectId(zemId),
    });
    if (!counter) {
      throw new NotFoundException('Aucun compteur trrouvé pour ce Zem');
    }

    const completedRaces = await this.racesModel.find({
      zem: new Types.ObjectId(zemId),
      status: 'end',
    });

    const totalKmByRaces = completedRaces.reduce(
      (total, race) => total + (race.distance_traveled || 0),
      0,
    );

    return {
      totalKilometersTraveled: counter.total_km_traveled,
      totalCompletedRaces: completedRaces.length,
      averageKilometersPerRace:
        completedRaces.length > 0 ? totalKmByRaces / completedRaces.length : 0,
      lastRace: completedRaces[0] || null,
    };
  }

  findAll() {
    return `This action returns all counter`;
  }

  update(id: number, updateCounterDto: UpdateCounterDto) {
    return `This action updates a #${id} counter`;
  }

  remove(id: number) {
    return `This action removes a #${id} counter`;
  }
}
