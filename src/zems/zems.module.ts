import { Module, forwardRef } from '@nestjs/common';
import { ZemsService } from './zems.service';
import { ZemsController } from './zems.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Zems, ZemsSchema } from '../Schemas/zems_schema/Zems.schema';
import { ZemValidationService } from './zem-validation.service';
import { CounterModule } from '../counter/counter.module';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { Config, ConfigSchema } from "../Schemas/config_schema/config.schema";
import { Races, RacesSchema } from "../Schemas/races_schema/races.schema";
import { WalletModule } from "../wallet/wallet.module";
import { ReferenceHistoryModule } from '../reference_history/reference_history.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Zems.name, schema: ZemsSchema },
      { name: Config.name, schema: ConfigSchema },
      { name: Races.name, schema: RacesSchema }
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => WalletModule),
    forwardRef(() => ReferenceHistoryModule),
    CounterModule,
    NotificationsModule,
  ],
  controllers: [ZemsController],
  providers: [
    ZemsService,
    ZemValidationService
  ],
  exports: [ZemsService],
})
export class ZemsModule {}