import { Module } from '@nestjs/common';
import { ZemsService } from './zems.service';
import { ZemsController } from './zems.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Zems, ZemsSchema } from '../Schemas/zems_schema/Zems.schema';
import { UsersService } from '../users/users.service';
import { Users, UserSchema } from '../Schemas/users_schema/Users.schema';
import { ZemValidationService } from './zem-validation.service';
import { CounterModule } from '../counter/counter.module';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import {Config, ConfigSchema} from "../Schemas/config_schema/config.schema";
import {Races, RacesSchema} from "../Schemas/races_schema/races.schema";
import {WalletModule} from "../wallet/wallet.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Zems.name, schema: ZemsSchema }]),
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
    MongooseModule.forFeature([{ name: Races.name, schema: RacesSchema }]),
    UsersModule,
    CounterModule,
    NotificationsModule,
    WalletModule
  ],
  controllers: [ZemsController],
  providers: [ZemsService, ZemValidationService, UsersService],
  exports: [ZemsService],
})
export class ZemsModule {}
