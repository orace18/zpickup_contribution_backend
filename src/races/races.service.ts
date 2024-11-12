import {BadRequestException, Injectable} from '@nestjs/common';
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

@Injectable()
export class RacesService {

    constructor(@InjectModel(Races.name) private racesModel: Model<Races>,
                @InjectModel(Zems.name) private zemsModel: Model<Zems>,
                @InjectModel(Config.name) private configModel: Model<Config>,
                private readonly userService: UsersService,
                private readonly zemsService: ZemsService,) {
    }

    async create(createRaceDto: CreateRaceDto, req) {
        createRaceDto.user = req.user.userId;
        createRaceDto.initial_datetime = new Date();
        createRaceDto.reference = await generateUniqueString(this.racesModel, "reference", "ZR");
        createRaceDto.qrcode_start = await generateUniqueString(this.racesModel, "qrcode_start", "ZR-QR-START");
        createRaceDto.qrcode_end = await generateUniqueString(this.racesModel, "qrcode_end", "ZR-QR-END");
        createRaceDto.status = CoursesStatus.PENDING;
        createRaceDto.pending_at = new Date();
        const created = new this.racesModel(createRaceDto);
        let saved = await created.save();

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

        console.log("user",req.user);
        switch (updateRaceDto.type_action) {
            case "stopped":
                updateRaceDto.status = CoursesStatus.STOPPED;
                updateRaceDto.stopped_at = new Date();
                this.userService.update(req.user.userId, {race: null});
                break;

            case "accepted":
                updateRaceDto.status = CoursesStatus.ACCEPTED;
                updateRaceDto.accepted_at = new Date();
                const zem = await this.zemsModel.findOne({user: new Types.ObjectId(req.user.userId)}).lean().exec();
                updateRaceDto.zem = new Types.ObjectId(zem._id);
                const id_object_type = new Types.ObjectId(id);
                await this.userService.update(req.user.userId, {race: id_object_type});
                break;

            case "started":
                const zem_started = await this.zemsModel.findOne({user: new Types.ObjectId(req.user.userId)}).lean().exec();
                let race = await this.racesModel.findOne({"qrcode_start": updateRaceDto.qrcode_start_value,"zem":zem_started._id})
                    .lean().exec();

                if(!race){
                    throw new BadRequestException("Course invalide");
                }

                updateRaceDto.status = CoursesStatus.START;
                updateRaceDto.started_at = new Date();
                break;

            case "ended":
                const zem_ended = await this.zemsModel.findOne({user: new Types.ObjectId(req.user.userId)}).lean().exec();
                let race_ended = await this.racesModel.findOne({"qrcode_end": updateRaceDto.qrcode_end_value,"zem":zem_ended._id})
                    .lean().exec();

                if(!race_ended){
                    throw new BadRequestException("Course invalide");
                }

                console.log("km",calculateDistance(race_ended.latitude_start,race_ended.longitude_start,updateRaceDto.latitude_end,updateRaceDto.longitude_end));
                updateRaceDto.distance_traveled = calculateDistance(race_ended.latitude_start,race_ended.longitude_start,updateRaceDto.latitude_end,updateRaceDto.longitude_end);
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
        }).populate("user", ["_id", "phone_number", "firstname", "lastname","race"]).lean().exec();

        let available_zems = [];
        for (let i = 0; i < zems.length; i++) {
            let zem = zems[i];
            let can_add = true;
            if(zem.user["race"]!==null && zem.user["race"]!==race.id ){
                can_add = false;
            }

            if(can_add){
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


}
