import { Injectable } from '@nestjs/common';
import { CreateRaceHistoryDto } from './dto/create-race_history.dto';
import { UpdateRaceHistoryDto } from './dto/update-race_history.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Races} from "../Schemas/races_schema/races.schema";
import {Model} from "mongoose";
import {RaceHistory} from "./entities/race_history.entity";

@Injectable()
export class RaceHistoryService {


  constructor(@InjectModel(RaceHistory.name) private raceHistoryModel: Model<RaceHistory>,) {

  }

  async create(createRaceHistoryDto: CreateRaceHistoryDto) {
    const created = new this.raceHistoryModel(createRaceHistoryDto);
    return await created.save();
  }

  findAll() {
    return `This action returns all raceHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} raceHistory`;
  }

  update(id: number, updateRaceHistoryDto: UpdateRaceHistoryDto) {
    return `This action updates a #${id} raceHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} raceHistory`;
  }
}
