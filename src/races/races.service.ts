import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRaceDto } from './dto/create-race.dto';
import { UpdateRaceDto } from './dto/update-race.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CoursesStatus, Races } from '../Schemas/races_schema/races.schema';
import {
  calculateDistance,
  estimateDuration,
  generateUniqueString,
  sendNotification,
  sendNotificationForSeveralTokens,
} from '../services/helpers.service';
import { UsersService } from '../users/users.service';
import { Zems } from '../Schemas/zems_schema/Zems.schema';
import { Config } from '../Schemas/config_schema/config.schema';
import { ZemsService } from '../zems/zems.service';
import { WalletService } from '../wallet/wallet.service';
import { NotificationService } from "../notifications/notification.service";
import * as process from "node:process";
import { CounterService } from "../counter/counter.service";
import { CounterType } from "../Schemas/counter-history_schema/counter_history.schema";
import { TransactionType } from "../Schemas/wallet_schema/wallet_transaction.schema";
import { ReferenceHistoryService } from 'src/reference_history/reference_history.service';
import { Users, UserType } from 'src/Schemas/users_schema/Users.schema';

@Injectable()
export class RacesService {
  constructor(
    @InjectModel(Races.name) private racesModel: Model<Races>,
    @InjectModel(Zems.name) private zemsModel: Model<Zems>,
    @InjectModel(Config.name) private configModel: Model<Config>,
    @InjectModel(Users.name) private usersModel: Model<Users>,
    private readonly usersService: UsersService,
    private readonly zemsService: ZemsService,
    private readonly walletService: WalletService,
    private readonly notificationService: NotificationService,
    private readonly counterService: CounterService,
    private readonly referenceHistoryService: ReferenceHistoryService,
  ) {
  }

  async create(createRaceDto: CreateRaceDto, req) {
    createRaceDto.user = req.user.userId;
    createRaceDto.initial_datetime = new Date();
    createRaceDto.created_at = new Date();
    createRaceDto.updated_at = new Date();
    
    createRaceDto.reference = await generateUniqueString(
      this.racesModel,
      'reference',
      'ZR',
    );
    createRaceDto.qrcode_start = await generateUniqueString(
      this.racesModel,
      'qrcode_start',
      'ZR-QR-START',
    );
    createRaceDto.qrcode_end = await generateUniqueString(
      this.racesModel,
      'qrcode_end',
      'ZR-QR-END',
    );
    createRaceDto.status = CoursesStatus.PENDING;
    createRaceDto.pending_at = new Date();
    const created = new this.racesModel(createRaceDto);
    const saved = await created.save();

    await this.usersService.update(req.user.userId, { race: saved._id });
    this.sendNotificationForAllZemInRay(saved);
    return saved;
  }

  async sendNotificationForAllZemInRay(race_saved) {
    const ray = await this.configModel.findOne({ key: 'ray' }).exec();
    const zems = await this.zemsModel
      .find({ service: true })
      .lean()
      .exec();
    const filteredZems = zems.filter(service => {
      const distance = calculateDistance(
        race_saved.initial_latitude,
        race_saved.initial_longitude,
        service.service_latitude,
        service.service_longitude
      );
      return (service.ray == null ? (distance <= parseFloat(ray.value)) : (distance <= service.ray));
    });
    const tokens = [];
    let body_notification_zem =
      'Nouvelle course disponible';
    let more_action_zem = 'available_race';
    for (let i = 0; i < filteredZems.length; i++) {
      const zem_user = await this.usersService.findOne(filteredZems[i].user.toString());
      if (zem_user) {
        this.notificationService.createNotification(zem_user._id.toString(), "Course disponible", body_notification_zem, process.env.NOTIFICATION_COMMANDE, {});
        if (zem_user.fcm_token && zem_user.user_type == "zem") {
          tokens.push(zem_user.fcm_token);
        }
      }
    }

    if (tokens.length > 0) {
      const send_data = {
        more_action: more_action_zem,
      };
      sendNotificationForSeveralTokens(
        'Course',
        body_notification_zem,
        tokens,
        send_data,
      );
    }

  }


  async findAll() {
    try {
      const races = await this.racesModel
        .find()
        .populate('user')
        .populate('zem')
        .populate('user')
        .lean()
        .exec();

      if (!races || races.length === 0) {
        throw new NotFoundException('Aucune course trouvée');
      }

      console.log('Résultat trouvé:', races);
      return races;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la récupération des courses');
    }
  }

  findOne(id: string) {
    return this.racesModel.findById(id)
      .populate({
        path: 'zem',
        populate: {
          path: 'user',
        },
      })
      .exec();
  }


  findOneAppendUser(id: string) {
    return this.racesModel.findById(id)
      .populate({
        path: 'zem',
        populate: {
          path: 'user',
        },
      })
      .populate({
        path: 'user',
      })
      .exec();
  }

  async update(id: string, updateRaceDto: UpdateRaceDto, req) {
    let body_notification = '';
    let more_action = '';

    let body_notification_zem = '';
    let more_action_zem = '';

    let zem_user = null;

    switch (updateRaceDto.type_action) {
      case 'stopped':
        updateRaceDto.status = CoursesStatus.STOPPED;
        updateRaceDto.stopped_at = new Date();
        this.usersService.update(req.user.userId, { race: null });
        body_notification = 'Vous avez arrêté la demande de course';
        const raceSendNotificationForAllZemInRay = await this.findOne(id);
        this.sendNotificationForAllZemInRay(raceSendNotificationForAllZemInRay);
        break;

      case 'canceled_by_zem':
        updateRaceDto.status = CoursesStatus.PENDING;
        this.usersService.update(req.user.userId, { race: null });
        body_notification_zem = 'Vous avez annulé la course';
        body_notification = 'Course annulée par le conducteur. Nouvelle recherche lancée';
        more_action = 'available_zem_after_canceled_by_zem';
        break;

      case 'canceled_by_customer':
        updateRaceDto.status = CoursesStatus.STOPPED;
        updateRaceDto.stopped_at = new Date();
        const race_canceled = await this.racesModel.findById(id).populate('zem').lean().exec();
        this.usersService.update(req.user.userId, { race: null });
        this.usersService.update(race_canceled.zem['user'].toString(), { race: null });
        body_notification = 'Vous avez annulé la demande de course';
        body_notification_zem = 'Course annulée par le client. Nouvelle recherche lancée';
        more_action_zem = 'available_race_after_canceled_by_customer';
        zem_user = await this.usersService.findOne(race_canceled.zem['user'].toString());
        break;

      case 'accepted':
        updateRaceDto.status = CoursesStatus.ACCEPTED;
        updateRaceDto.accepted_at = new Date();
        const zem = await this.zemsModel
          .findOne({ user: req.user.userId })
          .lean()
          .exec();
        updateRaceDto.zem = zem._id;
        const id_object_type = new Types.ObjectId(id);
        await this.usersService.update(req.user.userId, {
          race: id_object_type,
        });

        zem_user = await this.usersService.findOne(req.user.userId);
        const race_accepted = await this.racesModel.findById(id).lean().exec();
        const km = calculateDistance(
          race_accepted.initial_latitude,
          race_accepted.initial_longitude,
          zem.service_latitude,
          zem.service_longitude,
        );
        updateRaceDto.service_km = km;
        updateRaceDto.service_duration = estimateDuration(km).minutes;
        race_accepted.zem_before_started = false;

        body_notification = 'Course acceptée par un zem';
        more_action = 'fetch_zem';

        body_notification_zem = 'Vous avez accepté la course ';
        more_action_zem = 'update_race_accepted';

        break;

      case 'zem_before_started':
        const zem_data_started = await this.zemsModel
          .findOne({ user: req.user.userId })
          .lean()
          .exec();
        const race_before = await this.racesModel
          .findOne({
            _id: id,
            zem: zem_data_started._id,
          })
          .lean()
          .exec();

        if (!race_before) {
          throw new BadRequestException('Course invalide');
        }

        if(race_before.status !== CoursesStatus.ACCEPTED){
          throw new BadRequestException('Course déjà en attente de démarrage');
        }

        updateRaceDto.zem_before_started = true;
        updateRaceDto.zem_before_started_at = new Date();

        body_notification =
          'Utiliser votre code PIN pour accepter le démarrage';
        more_action = 'zem_before_started';
        break;

      case 'started':
        const user_started = await this.usersService.findUserOneByPayload({
          user: req.user.userId,
          code_pin: updateRaceDto.code_pin,
        });

        if (!user_started) {
          throw new BadRequestException('Votre code est invalide');
        }

        const race = await this.racesModel
          .findOne({
            _id: id,
          })
          .populate('zem')
          .lean()
          .exec();

        if (!race) {
          throw new BadRequestException('Course invalide');
        }

        updateRaceDto.status = CoursesStatus.START;
        updateRaceDto.started_at = new Date();

        
        race.zem_before_started = true;
        race.zem_before_started_at = new Date();

        if(race.status === CoursesStatus.START){
          throw new BadRequestException('Course déjà démarrée');
        }

        const zem_started = await this.usersService.findOne(
          race.zem['user'].toString(),
        );
        zem_user = zem_started;

        body_notification = 'Votre course a démarrée, bonne route';
        more_action = 'started';

        body_notification_zem = 'Le client a validé le demarrage, bonne route';
        more_action_zem = 'started';
        break;

      case 'zem_before_ended':
        const zem_data_ended = await this.zemsModel
          .findOne({ user: req.user.userId })
          .lean()
          .exec();
        const race_before_ended = await this.racesModel
          .findOne({
            _id: id,
            zem: zem_data_ended._id,
          })
          .lean()
          .exec();

        if (!race_before_ended) {
          throw new BadRequestException('Course invalide');
        }

        if(race_before_ended.status !== CoursesStatus.START){
          throw new BadRequestException('Course déjà en cours');
        }

        updateRaceDto.zem_before_ended = true;
        updateRaceDto.zem_before_ended_at = new Date();

        body_notification =
          'Utiliser votre code PIN pour accepter la fin de course';
        more_action = 'zem_before_ended';
        break;

      case 'ended':
        const user_ended = await this.usersService.findUserOneByPayload({
          user: req.user.userId,
          code_pin: updateRaceDto.code_pin,
        });

        console.log('user_ended', user_ended);

        if (!user_ended) {
          throw new BadRequestException('Votre code est invalide');
        }
        const race_ended = await this.racesModel
          .findById(id)
          .populate('zem')
          .populate('user')
          .lean()
          .exec();

        if (!race_ended) {
          throw new BadRequestException('Course invalide');
        }

        if(race_ended.status === CoursesStatus.END){
          throw new BadRequestException('Course en cours');  
        }

        race_ended.zem_before_ended = false;
        race_ended.zem_before_ended_at = new Date();

        updateRaceDto.distance_traveled = calculateDistance(
          race_ended.latitude_start,
          race_ended.longitude_start,
          race_ended.latitude_end,
          race_ended.longitude_end,
        );
        updateRaceDto.distance_traveled = (updateRaceDto.distance_traveled < 1) ? 1 : updateRaceDto.distance_traveled;
        updateRaceDto.status = CoursesStatus.END;
        updateRaceDto.ended_at = new Date();

        const zem_final = await this.usersService.findOne(
          race_ended.zem['user'].toString(),
        );
        zem_user = zem_final;
        await this.usersService.update(race_ended.user['_id'].toString(), {
          race: null,
        });
        await this.usersService.update(zem_final._id.toString(), { race: null });

        await this.zemsService.update(race_ended.zem['_id'].toString(), {
          service: false,
          service_latitude: null,
          service_longitude: null,
        });
        this.counterService.debitOrCreditCounter(race_ended.zem['_id'].toString(), updateRaceDto.distance_traveled, "Course effectuée #" + race_ended["reference"], CounterType.OUTPUT);
        this.addWalletPercentWinForEndedRace(race_ended['_id'].toString());
        body_notification = 'Votre course est terminée. Merci';
        more_action = 'ended';

        body_notification_zem =
          'Le client a validé la fin, merci pour votre service';
        more_action_zem = 'ended';
        break;
    }

    await this.racesModel.findByIdAndUpdate(id, updateRaceDto).exec();
    const race = await this.findOne(id);


    const user = await this.usersService.findOne(race.user.toString());
    const title = "Course " + race.reference;
    try {
      if (user.fcm_token) {
        const send_data = {
          _id: race._id.toString(),
          more_action: more_action,
        };
        sendNotification(title, body_notification, user.fcm_token, send_data);
        this.notificationService.createNotification(user._id.toString(), title, body_notification, process.env.NOTIFICATION_COMMANDE, send_data);

      }
      if (zem_user) {
        if (zem_user.fcm_token) {
          const send_data = {
            _id: race._id.toString(),
            more_action: more_action_zem,
          };
          sendNotification(
            title,
            body_notification_zem,
            zem_user.fcm_token,
            send_data,
          );
          this.notificationService.createNotification(zem_user._id.toString(), title, body_notification_zem, process.env.NOTIFICATION_COMMANDE, send_data);

        }
      }

      return race;
    } catch (e) {

    }
  }


  async addWalletPercentWinForEndedRace(race_id: string) {

    const customer_race_bonus = await this.configModel.findOne({ key: 'percent-share-customer' }).exec();
    const zem_race_bonus = await this.configModel.findOne({ key: 'percent-share-zem' }).exec();
    const km_price = await this.configModel.findOne({ key: 'km-price' }).exec();

    const race = await this.findOne(race_id);

    if (race["status"] == "end") {
      let zem_user = await this.usersService.findUserOneByPayload({ zem: race["zem"]["_id"] });
      const race_user = await this.usersService.findUserOneByPayload({ _id: race["user"].toString() });
      let amount_for_admin = parseFloat(race["distance_traveled"].toFixed(2)) * (parseFloat(km_price["value"]));
      let amount_for_zem = parseFloat(race["distance_traveled"].toFixed(2)) * (parseFloat(km_price["value"]) * (parseFloat(zem_race_bonus["value"]) / 100));
      let amount_for_user = parseFloat(race["distance_traveled"].toFixed(2)) * (parseFloat(km_price["value"]) * (parseFloat(customer_race_bonus["value"]) / 100));
      amount_for_zem = parseFloat(amount_for_zem.toFixed(2));
      amount_for_user = parseFloat(amount_for_user.toFixed(2));
      amount_for_admin = parseFloat(amount_for_admin.toFixed(2));
      let amount_for_admin_percent = parseFloat(((parseFloat(amount_for_admin.toFixed(2)) - amount_for_zem - amount_for_user)).toFixed(2));

      this.racesModel.findByIdAndUpdate(race["_id"].toString(), {
        zem_bonus: amount_for_zem,
        customer_bonus: amount_for_user,
        admin_bonus: amount_for_admin_percent,
        zem_percent: parseFloat(zem_race_bonus["value"]),
        customer_percent: parseFloat(customer_race_bonus["value"]),
        admin_percent: (100 - parseFloat(customer_race_bonus["value"]) - parseFloat(zem_race_bonus["value"])),
        amount_per_km: parseFloat(km_price["value"]),
        amount_total_bonus: parseFloat(amount_for_admin.toFixed(2)),
      }).exec();

      // Attribution du bonus client
      if (race_user.length > 0) {
        this.walletService.creditWalletUserCustomBalance(race_user[0]["_id"].toString(), amount_for_user, "Course bonus", "Vous avez obtenu un gain de " + amount_for_user + " XOF suite à votre course " + race["reference"] + ". ZPickup vous remercie de nous avoir choisi", TransactionType.BONUS, "user");
      }

      // Nouvelle logique pour l'attribution du bonus au Zem
      if (zem_user.length > 0) {
        const zemId = zem_user[0]["_id"].toString();

        // On récupère le compteur du zem pour verifier si il est ambassadeur
        const zemCounter = await this.counterService.findCounterByUser(zemId);

        // On verifie si le zem est ambassadeur
        if (zemCounter && zemCounter.balance_abs_km > 0) {
          // Le Zem est ambassadeur, on vérifie si balance_abs_km sera réduit à 0 après cette course
          const kmTraveled = parseFloat(race["distance_traveled"].toFixed(2));
          const newBalanceAbsKm = zemCounter.balance_abs_km - kmTraveled;

          if (newBalanceAbsKm <= 0) {
            // Si après cette course balance_abs_km sera <= 0, on attribue le bonus sur la partie qui dépasse 0
            // Car cette partie n'est plus couverte par les km gratuits
            const bonusKm = Math.abs(Math.min(0, newBalanceAbsKm));

            if (bonusKm > 0) {
              // Calculer le bonus seulement sur les km qui dépassent balance_abs_km
              const partialBonus = parseFloat((bonusKm * parseFloat(km_price["value"]) * (parseFloat(zem_race_bonus["value"]) / 100)).toFixed(2));

              if (partialBonus > 0) {
                this.walletService.creditWalletUserCustomBalance(
                  zemId,
                  partialBonus,
                  "Course bonus partiel",
                  "Vous avez obtenu un gain de " + partialBonus + " XOF suite à votre course " + race["reference"] + " pour " + bonusKm.toFixed(2) + " km. ZPickup vous remercie de nous avoir choisi",
                  TransactionType.BONUS,
                  "user"
                );
              }
            }
          }
          // Dans tous les autres cas, pas de bonus car toujours en train d'utiliser les km gratuits
        } else {
          // Le Zem n'est pas ambassadeur ou a déjà utilisé tous ses km gratuits,
          // on lui attribue le bonus complet
          this.walletService.creditWalletUserCustomBalance(
            zemId,
            amount_for_zem,
            "Course bonus",
            "Vous avez obtenu un gain de " + amount_for_zem + " XOF suite à votre course " + race["reference"] + ". ZPickup vous remercie de nous avoir choisi",
            TransactionType.BONUS,
            "user"
          );
        }

        // this.walletService.creditWalletUserCustomBalance(zem_user[0]["_id"].toString(), amount_for_zem, "Course bonus", "Vous avez obtenu un gain de " + amount_for_zem + " XOF suite à votre course " + race["reference"] + ". ZPickup vous remercie de nous avoir choisi", TransactionType.BONUS);
      }

    }

  }

  remove(id: number) {
    return `This action removes a #${id} race`;
  }

  async availableZems(id: string) {
    const race = await this.racesModel.findById(id).exec();
    const ray = await this.configModel.findOne({ key: 'ray' }).exec();
    const zems: Zems[] = await this.zemsModel
      .find({
        validated_at: { $ne: null },
        profile_validation_status: 'validated',
        service: true,
      })
      .populate('user', [
        '_id',
        'phone_number',
        'firstname',
        'lastname',
        'race',
      ])
      .lean()
      .exec();

    const available_zems = [];
    for (let i = 0; i < zems.length; i++) {
      const zem = zems[i];
      console.log("zem "+i,zem);
      let can_add = false;
      if(zem.user!=null){
        if (zem.user['race'] == null) {
          can_add = true;
        } else {
          if (zem.user['race'] == undefined) {
            can_add = true;
          } else {
            if (zem.user['race'].toString() == race._id.toString()) {
              can_add = true;
            }
          }
        }
      }

      if (can_add) {
        const km = calculateDistance(
          race.initial_latitude,
          race.initial_longitude,
          zem.service_latitude,
          zem.service_longitude,
        );

        if (zem.ray == null) {
          if (km <= parseFloat(ray.value)) {
            zem.service_km = km;
            zem.service_duration = estimateDuration(km).minutes;
            available_zems.push(zem);
          }
        } else {
          if (km <= zem.ray) {
            zem.service_km = km;
            zem.service_duration = estimateDuration(km).minutes;
            available_zems.push(zem);
          }
        }
      }
    }
    available_zems.sort((a, b) => a.service_km - b.service_km);

    return available_zems;
  }

  async availableRaces(req) {
    const zem = await this.zemsModel
      .findOne({ user: req.user.userId })
      .lean()
      .exec();

    const ray = await this.configModel.findOne({ key: 'ray' }).exec();
    const races: Races[] = await this.racesModel
      .find({
        status: CoursesStatus.PENDING,
      })
      .populate('user', [
        '_id',
        'phone_number',
        'firstname',
        'lastname',
        'user_profile_image',
        'race',
      ])
      .lean()
      .exec();

    const availables = [];
    for (let i = 0; i < races.length; i++) {
      const race = races[i];
      const km = calculateDistance(
        race.initial_latitude,
        race.initial_longitude,
        zem.service_latitude,
        zem.service_longitude,
      );
      console.log("KM: ", km);
      console.log("ZEM: ", zem);
      console.log("RACE: ", race);
      if (zem.ray == null) {
        if (km <= parseFloat(ray.value)) {
          race.service_km = km;
          race.service_duration = estimateDuration(km).minutes;
          availables.push(race);
        }
      } else {
        if (km <= zem.ray) {
          race.service_km = km;
          race.service_duration = estimateDuration(km).minutes;
          availables.push(race);
        }
      }
    }
    availables.sort((a, b) => a.service_km - b.service_km);

    return availables;
  }

  async getRaceHistory(zemId: string) {
    if (!Types.ObjectId.isValid(zemId)) {
      throw new NotFoundException('ID Zem invalide');
    }
    const races = await this.racesModel
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
      initial_location: {
        longitude: race.initial_longitude,
        latitude: race.initial_latitude,
        datetime: race.initial_datetime,
      },
      start_location: {
        longitude: race.longitude_start,
        latitude: race.latitude_start,
        datetime: race.started_at,
      },
      end_location: {
        longitude: race.longitude_end,
        latitude: race.latitude_end,
        datetime: race.ended_at,
      },
      service_km: race.service_km,
      status: race.status,
      timeline: {
        created_at: race.created_at,
        pending_at: race.pending_at,
        accepted_at: race.accepted_at,
        started_at: race.started_at,
        ended_at: race.ended_at,
        stopped_at: race.stopped_at,
      },
    }));
    return {
      total_races: races.length,
      total_kilometers: races.reduce(
        (sum, race) => sum + (race.distance_traveled || 0),
        0,
      ),
      races: formattedRaces,
    };
  }

  async findAllRacesByZem(zemId: string) {
    console.log(`ZemId reçu : ${zemId}`);
    const objectId = new Types.ObjectId(zemId);
    const races = await this.racesModel
      .find({ zem: objectId, status: "end" })
      .populate('user')
      .populate({
        path: 'zem',
        populate: {
          path: 'user',
        },
      })
      .sort({ created_at: -1 })
      .lean()
      .exec();
    console.log(`Résultat trouvé pour le zemId ${zemId}:`, races);
    if (!races || races.length === 0) {
      throw new NotFoundException(`Aucune course trouvée pour ce zem.`);
    }
    return races;
  }

  async findAllRacesByUser(userId: string) {
    const races = await this.racesModel
      .find({
        user: userId,
        status: "end"
      })
      .populate({
        path: 'zem',
        populate: {
          path: 'user',
        },
      })
      .sort({ created_at: -1 })
      .lean()
      .exec();
    if (!races || races.length === 0) {
      throw new NotFoundException(
        `Aucune course trouvée pour cet utilisateur.`,
      );
    }
    return races;
  }

  async updateZemRay(userId: string, ray: number) {
    const zem = await this.zemsModel.findOne({ user: userId }).exec();

    if (ray < 0) {
      throw new BadRequestException('Le rayon doit être un nombre positif');
    }

    await this.zemsModel.findByIdAndUpdate(zem._id, { ray: ray }).exec();

    return ray;
  }

}
