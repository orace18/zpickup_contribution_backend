import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
} from '../services/helpers.service';
import { UsersService } from '../users/users.service';
import { Zems } from '../Schemas/zems_schema/Zems.schema';
import { Config } from '../Schemas/config_schema/config.schema';
import { UserType } from '../Schemas/users_schema/Users.schema';
import { ZemsService } from '../zems/zems.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class RacesService {
  constructor(
    @InjectModel(Races.name) private racesModel: Model<Races>,
    @InjectModel(Zems.name) private zemsModel: Model<Zems>,
    @InjectModel(Config.name) private configModel: Model<Config>,
    private readonly userService: UsersService,
    private readonly zemsService: ZemsService,
    private readonly walletService: WalletService,
  ) {}

  async create(createRaceDto: CreateRaceDto, req) {
    createRaceDto.user = req.user.userId;
    createRaceDto.initial_datetime = new Date();
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

    await this.userService.update(req.user.userId, { race: saved._id });

    return saved;
  }

  findAll() {
    return `This action returns all races`;
  }

  findOne(id: string) {
    return this.racesModel.findById(id).exec();
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
        this.userService.update(req.user.userId, { race: null });
        body_notification = 'Vous avez arrêté la demande de course';
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
        await this.userService.update(req.user.userId, {
          race: id_object_type,
        });

        zem_user = await this.userService.findOne(req.user.userId);
        const race_accepted = await this.racesModel.findById(id).lean().exec();
        const km = calculateDistance(
          race_accepted.initial_latitude,
          race_accepted.initial_longitude,
          zem.service_latitude,
          zem.service_longitude,
        );
        updateRaceDto.service_km = km;
        updateRaceDto.service_duration = estimateDuration(km).minutes;

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

        body_notification =
          'Utiliser votre code PIN pour accepter le démarrage';
        more_action = 'zem_before_started';
        break;

      case 'started':
        const user_started = await this.userService.findUserOneByPayload({
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

        const zem_started = await this.userService.findOne(
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

        body_notification =
          'Utiliser votre code PIN pour accepter la fin de course';
        more_action = 'zem_before_ended';
        break;

      case 'ended':
        const user_ended = await this.userService.findUserOneByPayload({
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

        updateRaceDto.distance_traveled = calculateDistance(
          race_ended.latitude_start,
          race_ended.longitude_start,
          race_ended.latitude_end,
          race_ended.longitude_end,
        );
        updateRaceDto.status = CoursesStatus.END;
        updateRaceDto.ended_at = new Date();

        const zem_final = await this.userService.findOne(
          race_ended.zem['user'].toString(),
        );
        zem_user = zem_final;

        await this.userService.update(race_ended.user.toString(), {
          race: null,
        });
        await this.userService.update(zem_final._id.toString(), { race: null });

        await this.zemsService.update(race_ended.zem['_id'].toString(), {
          service: false,
          service_latitude: null,
          service_longitude: null,
        });

        /*Ajout des bonus aux portefeuilles*/
        try {
          await Promise.all([
            this.walletService.addRaceBonus(
              race_ended.user.toString(),
              UserType.CUSTOMER,
            ),
            this.walletService.addRaceBonus(
              race_ended.zem['user'].toString(),
              UserType.ZEM,
            ),
          ]);
        } catch (error) {
          console.error("Erreur lors de l'ajout des bonus:", error);
        }

        body_notification = 'Votre course est terminée. Merci';
        more_action = 'ended';

        body_notification_zem =
          'Le client a validé la fin, merci pour votre service';
        more_action_zem = 'ended';
        break;
    }

    console.log('zem_user', zem_user);
    await this.racesModel.findByIdAndUpdate(id, updateRaceDto).exec();
    const race = await this.findOne(id);
    const user = await this.userService.findOne(race.user.toString());
    if (user.fcm_token) {
      const send_data = {
        _id: race._id.toString(),
        more_action: more_action,
      };
      sendNotification('Course', body_notification, user.fcm_token, send_data);
    }
    if (zem_user) {
      if (zem_user.fcm_token) {
        const send_data = {
          _id: race._id.toString(),
          more_action: more_action_zem,
        };
        sendNotification(
          'Course',
          body_notification_zem,
          zem_user.fcm_token,
          send_data,
        );
      }
    }

    return race;
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
      let can_add = false;
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

      if (can_add) {
        const km = calculateDistance(
          race.initial_latitude,
          race.initial_longitude,
          zem.service_latitude,
          zem.service_longitude,
        );
        if (km <= parseFloat(ray.value)) {
          zem.service_km = km;
          zem.service_duration = estimateDuration(km).minutes;
          available_zems.push(zem);
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
      if (km <= parseFloat(ray.value)) {
        race.service_km = km;
        race.service_duration = estimateDuration(km).minutes;
        availables.push(race);
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
      .find({ zem: objectId })
      .populate('user')
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
      .find({ user: userId })
      .populate('zem')
      .lean()
      .exec();
    if (!races || races.length === 0) {
      throw new NotFoundException(
        `Aucune course trouvée pour cet utilisateur.`,
      );
    }
    return races;
  }
}
