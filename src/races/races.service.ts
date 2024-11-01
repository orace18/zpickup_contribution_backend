import { Injectable } from '@nestjs/common';
import { CreateRaceDto } from './dto/create-race.dto';
import { UpdateRaceDto } from './dto/update-race.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {CoursesStatus, Races} from "../Schemas/races_schema/races.schema";
import {generateUniqueString} from "../services/helpers.service";
import {UsersService} from "../users/users.service";

@Injectable()
export class RacesService {

  constructor(@InjectModel(Races.name) private racesModel:Model<Races>, private readonly userService:UsersService) {}

  async create(createRaceDto: CreateRaceDto,req) {
    createRaceDto.user = req.user.userId;
    createRaceDto.initial_datetime = new Date();
    createRaceDto.reference = await generateUniqueString(this.racesModel,"reference","ZR");
    createRaceDto.qrcode_start = await generateUniqueString(this.racesModel,"qrcode_start","ZR-QR-START");
    createRaceDto.qrcode_end = await generateUniqueString(this.racesModel,"qrcode_end","ZR-QR-END");
    createRaceDto.status = CoursesStatus.PENDING;
    const created = new this.racesModel(createRaceDto);
    return await created.save();
  }

  findAll() {
    return `This action returns all races`;
  }

  findOne(id: number) {
    return `This action returns a #${id} race`;
  }

  update(id: number, updateRaceDto: UpdateRaceDto) {
    return `This action updates a #${id} race`;
  }

  remove(id: number) {
    return `This action removes a #${id} race`;
  }
}
