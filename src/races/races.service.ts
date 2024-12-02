import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import {CreateRaceDto} from './dto/create-race.dto';
import {UpdateRaceDto} from './dto/update-race.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {CoursesStatus, Races} from "../Schemas/races_schema/races.schema";
import {calculateDistance, generateUniqueString} from "../services/helpers.service";
import {UsersService} from "../users/users.service";
import {Zems} from "../Schemas/zems_schema/Zems.schema";
import {Config} from "../Schemas/config_schema/config.schema";
import {Users} from "../Schemas/users_schema/Users.schema";
import {ZemsService} from "../zems/zems.service";
import {Race} from "./entities/race.entity";
import { ObjectId } from 'mongoose';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class RacesService {

    constructor(@InjectModel(Races.name) private racesModel: Model<Races>,
                @InjectModel(Zems.name) private zemsModel: Model<Zems>,
                @InjectModel(Config.name) private configModel: Model<Config>,
                private readonly userService: UsersService,
                private readonly zemsService: ZemsService,
                private readonly websocketGateway: WebsocketGateway,) {
    }

    async create(createRaceDto: CreateRaceDto, req) {

        // Vérifier s'il existe déjà une course active pour cet utilisateur
        const existingActiveRace = await this.racesModel.findOne({
            user: new Types.ObjectId(req.user.userId),
            status: {
                $in: [CoursesStatus.PENDING, CoursesStatus.ACCEPTED, CoursesStatus.START]
            }
        });

        if (existingActiveRace) {
            throw new HttpException(
              'Une course est déjà en cours',
              HttpStatus.BAD_REQUEST
            );
        }

        createRaceDto.user = req.user.userId;
        createRaceDto.initial_datetime = new Date();
        createRaceDto.reference = await generateUniqueString(this.racesModel, "reference", "ZR");
        createRaceDto.qrcode_start = await generateUniqueString(this.racesModel, "qrcode_start", "ZR-QR-START");
        createRaceDto.qrcode_end = await generateUniqueString(this.racesModel, "qrcode_end", "ZR-QR-END");
        createRaceDto.status = CoursesStatus.PENDING;
        createRaceDto.pending_at = new Date();
        const created = new this.racesModel(createRaceDto);
        const saved = await created.save();

        await this.userService.update(req.user.userId, {race: saved._id});

        return saved;
    }

    findAll() {
        return `This action returns all races`;
    }

    findOne(id: number) {
        return `This action returns a #${id} race`;
    }

    async update(id: string, updateRaceDto: UpdateRaceDto, req) {

        console.log("user", req.user);
        switch (updateRaceDto.type_action) {
            case "stopped":
                updateRaceDto.status = CoursesStatus.STOPPED;
                updateRaceDto.stopped_at = new Date();
                this.userService.update(req.user.userId, {race: null});
                break;

            case "accepted":
                updateRaceDto.status = CoursesStatus.ACCEPTED;
                updateRaceDto.accepted_at = new Date();
                const zem = await this.zemsModel.findOne({user: req.user.userId}).lean().exec();
                updateRaceDto.zem = new Types.ObjectId(zem._id);
                const id_object_type = new Types.ObjectId(id);
                await this.userService.update(req.user.userId, {race: id_object_type});

                this.websocketGateway.sendUpdate({
                    markerId: id,
                    isAccepted: true,
                })
                break;

            case "started":
                const zem_started = await this.zemsModel.findOne({user: req.user.userId}).lean().exec();
                let race = await this.racesModel.findOne({
                    "qrcode_start": updateRaceDto.qrcode_start_value,
                    "zem": zem_started._id
                })
                    .lean().exec();

                if (!race) {
                    throw new BadRequestException("Course invalide");
                }

                updateRaceDto.status = CoursesStatus.START;
                updateRaceDto.started_at = new Date();
                break;

            case "ended":
                const zem_ended = await this.zemsModel.findOne({user: req.user.userId}).lean().exec();
                let race_ended = await this.racesModel.findOne({
                    "qrcode_end": updateRaceDto.qrcode_end_value,
                    "zem": zem_ended._id
                })
                    .lean().exec();

                if (!race_ended) {
                    throw new BadRequestException("Course invalide");
                }

                console.log("km", calculateDistance(race_ended.latitude_start, race_ended.longitude_start, updateRaceDto.latitude_end, updateRaceDto.longitude_end));
                updateRaceDto.distance_traveled = calculateDistance(race_ended.latitude_start, race_ended.longitude_start, updateRaceDto.latitude_end, updateRaceDto.longitude_end);
                updateRaceDto.status = CoursesStatus.END;
                updateRaceDto.ended_at = new Date();
                break;

        }

        return this.racesModel
            .findByIdAndUpdate(id, updateRaceDto)
            .exec();

    }

    remove(id: number) {
        return `This action removes a #${id} race`;
    }

    async availableZems(id: string) {

        const race = await this.racesModel.findById(id).exec();
        const ray = await this.configModel.findOne({key: "ray"}).exec();
        const zems: Zems[] = await this.zemsModel.find({
            validated_at: {$ne: null},
            profile_validation_status: "validated",
            service: true
        }).populate("user", ["_id", "phone_number", "firstname", "lastname", "race"]).lean().exec();

        let available_zems = [];
        for (let i = 0; i < zems.length; i++) {
            let zem = zems[i];
            let can_add = false;
            if (zem.user["race"] == null) {
                can_add = true;
            } else {
                if (zem.user["race"] == undefined) {
                    can_add = true;
                } else {
                    if (zem.user["race"].toString() == race._id.toString()) {
                        can_add = true;
                    }
                }
            }

            if (can_add) {
                const km = calculateDistance(race.initial_latitude, race.initial_longitude, zem.service_latitude, zem.service_longitude);
                if (km <= parseFloat(ray.value)) {
                    zem.service_km = km;
                    available_zems.push(zem);
                }
            }

        }
        available_zems.sort((a, b) => a.service_km - b.service_km);

        return available_zems;
    }

    async availableRaces(req) {
        const zem = await this.zemsModel.findOne({user: req.user.userId}).lean().exec();

        const ray = await this.configModel.findOne({key: "ray"}).exec();
        const races: Races[] = await this.racesModel.find({
            status: CoursesStatus.PENDING
        }).populate("user", ["_id", "phone_number", "firstname", "lastname", "race"]).lean().exec();

        let availables = [];
        for (let i = 0; i < races.length; i++) {
            let race = races[i];

            let can_add = false;

            const km = calculateDistance(race.initial_latitude, race.initial_longitude, zem.service_latitude, zem.service_longitude);
            if (km <= parseFloat(ray.value)) {
                race.service_km = km;
                availables.push(race);
            }
        }
        availables.sort((a, b) => a.service_km - b.service_km);

        return availables;
    }

    async findAllRacesByUser(userId: string) {
        // Recherche des courses liées à cet utilisateur
        const races = await this.racesModel.find({ user: userId })
          .populate('zem') // Inclure les informations sur le Zem si nécessaire
          .lean()
          .exec();

        if (!races || races.length === 0) {
            throw new NotFoundException(`Aucune course trouvée pour cet utilisateur.`);
        }

        return races;
    }

    async findAllRacesByZem(zemId: string) {
        console.log(`ZemId reçu : ${zemId}`);

        // Convertir zemId en ObjectId
        const objectId = new Types.ObjectId(zemId);

        // Requête avec le ObjectId
        const races = await this.racesModel.find({ zem: objectId })
          .populate('user') // Facultatif : inclure des infos utilisateur
          .lean()
          .exec();

        console.log(`Résultat trouvé pour le zemId ${zemId}:`, races);

        if (!races || races.length === 0) {
            throw new NotFoundException(`Aucune course trouvée pour ce zem.`);
        }

        return races;
    }

    async getRaceHistory(zemId: string) {

        if (!Types.ObjectId.isValid(zemId)) {

            throw new NotFoundException('ID Zem invalide');

        }

        const races = await this.racesModel

          .find({

              zem: new Types.ObjectId(zemId),

              status: CoursesStatus.END

          })

          .sort({ ended_at: -1 })

          .lean()

          .exec();

        const formattedRaces = races.map(race => ({

            _id: race._id,

            reference: race.reference,

            initial_location: {

                longitude: race.initial_longitude,

                latitude: race.initial_latitude,

                datetime: race.initial_datetime

            },

            start_location: {

                longitude: race.longitude_start,

                latitude: race.latitude_start,

                datetime: race.started_at

            },

            end_location: {

                longitude: race.longitude_end,

                latitude: race.latitude_end,

                datetime: race.ended_at

            },

            service_km: race.service_km,

            status: race.status,

            timeline: {

                created_at: race.created_at,

                pending_at: race.pending_at,

                accepted_at: race.accepted_at,

                started_at: race.started_at,

                ended_at: race.ended_at,

                stopped_at: race.stopped_at

            }

        }));

        return {

            total_races: races.length,

            total_kilometers: races.reduce((sum, race) => sum + (race.distance_traveled || 0), 0),

            races: formattedRaces

        };

    }


}
