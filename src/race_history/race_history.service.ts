import {forwardRef, Inject, Injectable} from '@nestjs/common';
import { CreateRaceHistoryDto } from './dto/create-race_history.dto';
import { UpdateRaceHistoryDto } from './dto/update-race_history.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Races} from "../Schemas/races_schema/races.schema";
import {Model, Types} from "mongoose";
import {RaceHistory} from "./entities/race_history.entity";
import {Race} from "../races/entities/race.entity";
import {WalletService} from "../wallet/wallet.service";
import {RacesService} from "../races/races.service";

@Injectable()
export class RaceHistoryService {


  constructor(@InjectModel(RaceHistory.name) private raceHistoryModel: Model<RaceHistory>,
              @Inject(forwardRef(() => RacesService))
              private readonly racesService: RacesService,
  ) {

  }

  async create(createRaceHistoryDto: CreateRaceHistoryDto) {
    const created = new this.raceHistoryModel(createRaceHistoryDto);
    return await created.save();
  }

  findAll() {
    return this.raceHistoryModel.find().populate("race").exec();
  }

  async findRaceLiveLocation(race_id:string) {
    let race = await this.racesService.findOneAppendUser(race_id);
    let race_user_live_history = await this.raceHistoryModel
        .findOne({user:race["user"]["_id"].toString(),
          race:race["_id"].toString(), })
        .sort({ created_at: -1 }).lean().exec();
    let race_zem_live_history = await this.raceHistoryModel
        .findOne({user:race["zem"]["user"]["_id"].toString(),race:race["_id"].toString(),  })
        .sort({ created_at: -1 }).lean().exec();

   console.log("live_history",{
     race_zem_live_history : race_zem_live_history,
     race_user_live_history : race_user_live_history,
   });

    return {
      race_zem_live_history : race_zem_live_history,
      race_user_live_history : race_user_live_history,
      race : race
    };
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
