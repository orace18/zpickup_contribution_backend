import {forwardRef, Module} from '@nestjs/common';
import { RaceHistoryService } from './race_history.service';
import { RaceHistoryController } from './race_history.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {RaceHistory, RaceHistorySchema} from "./entities/race_history.entity";
import {RacesModule} from "../races/races.module";
import {Races, RacesSchema} from "../Schemas/races_schema/races.schema";
import {RacesService} from "../races/races.service";
import {RacesController} from "../races/races.controller";
import {ReferenceHistoryModule} from "../reference_history/reference_history.module";
import {ZemsModule} from "../zems/zems.module";
import {Zems, ZemsSchema} from "../Schemas/zems_schema/Zems.schema";
import {Config, ConfigSchema} from "../Schemas/config_schema/config.schema";
import {UsersService} from "../users/users.service";
import {ZemsService} from "../zems/zems.service";
import {WalletModule} from "../wallet/wallet.module";
import {NotificationsModule} from "../notifications/notifications.module";
import {CounterModule} from "../counter/counter.module";
import {UsersModule} from "../users/users.module";
import {Users, UserSchema} from "../Schemas/users_schema/Users.schema";
import {ReferenceHistoryService} from "../reference_history/reference_history.service";
import {ReferenceHistory} from "../reference_history/entities/reference_history.entity";
import {ReferenceHistorySchema} from "../Schemas/reference_history_schema/reference_history_schema.schema";

@Module({
  imports:[
    MongooseModule.forFeature([{ name: RaceHistory.name, schema: RaceHistorySchema }]),
    MongooseModule.forFeature([{ name: Races.name, schema: RacesSchema }]),
    MongooseModule.forFeature([{ name: Zems.name, schema: ZemsSchema }]),
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
    MongooseModule.forFeature([{ name: ReferenceHistory.name, schema: ReferenceHistorySchema }]),
    WalletModule,
      NotificationsModule,
      CounterModule,
    forwardRef(() => RacesModule),

  ],
  controllers: [RaceHistoryController],
  providers: [RaceHistoryService,RacesService,ZemsService, ReferenceHistoryService],
  exports: [RacesService],
})
export class RaceHistoryModule {}
