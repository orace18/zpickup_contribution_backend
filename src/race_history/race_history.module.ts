import { Module } from '@nestjs/common';
import { RaceHistoryService } from './race_history.service';
import { RaceHistoryController } from './race_history.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {RaceHistory, RaceHistorySchema} from "./entities/race_history.entity";

@Module({
  imports:[
    MongooseModule.forFeature([{ name: RaceHistory.name, schema: RaceHistorySchema }]),
  ],
  controllers: [RaceHistoryController],
  providers: [RaceHistoryService],
})
export class RaceHistoryModule {}
