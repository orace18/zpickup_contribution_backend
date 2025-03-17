import {forwardRef, Module} from '@nestjs/common';
import { RaceHistoryService } from './race_history.service';
import { RaceHistoryController } from './race_history.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {RaceHistory, RaceHistorySchema} from "./entities/race_history.entity";
import {RacesModule} from "../races/races.module";
import {Races, RacesSchema} from "../Schemas/races_schema/races.schema";
import {RacesService} from "../races/races.service";
import {ReferenceHistoryModule} from "../reference_history/reference_history.module";
import {ZemsModule} from "../zems/zems.module";
import {Zems, ZemsSchema} from "../Schemas/zems_schema/Zems.schema";
import {Config, ConfigSchema} from "../Schemas/config_schema/config.schema";
import {Users, UsersSchema} from "../Schemas/users_schema/Users.schema";
import {ZemsService} from "../zems/zems.service";
import {WalletModule} from "../wallet/wallet.module";
import {NotificationsModule} from "../notifications/notifications.module";
import {CounterModule} from "../counter/counter.module";
import {UsersModule} from "../users/users.module";
import {ReferenceHistoryService} from "../reference_history/reference_history.service";
import {ReferenceHistory} from "../reference_history/entities/reference_history.entity";
import {ReferenceHistorySchema} from "../Schemas/reference_history_schema/reference_history_schema.schema";
import { AbsKmHistory, AbsKmHistorySchema } from 'src/Schemas/abs_km_history/abs_km_history.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RaceHistory.name, schema: RaceHistorySchema },
      { name: Races.name, schema: RacesSchema },
      { name: Zems.name, schema: ZemsSchema },
      { name: Config.name, schema: ConfigSchema },
      { name: Users.name, schema: UsersSchema }, // Ajout du UsersModel
      { name: ReferenceHistory.name, schema: ReferenceHistorySchema },
      { name: AbsKmHistory.name, schema: AbsKmHistorySchema},
    ]),
    forwardRef(() => RacesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => ZemsModule),
    WalletModule,
    NotificationsModule,
    CounterModule,
    ReferenceHistoryModule,
  ],
  controllers: [RaceHistoryController],
  providers: [
    RaceHistoryService,
    RacesService,
    ZemsService,
    ReferenceHistoryService
  ],
  exports: [RaceHistoryService]
})
export class RaceHistoryModule {}