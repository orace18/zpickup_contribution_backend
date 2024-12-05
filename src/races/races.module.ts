import { Module } from '@nestjs/common';
import { RacesService } from './races.service';
import { RacesController } from './races.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Zems, ZemsSchema} from "../Schemas/zems_schema/Zems.schema";
import {Races, RacesSchema} from "../Schemas/races_schema/races.schema";
import {Users, UserSchema} from "../Schemas/users_schema/Users.schema";
import {UsersService} from "../users/users.service";
import {Config, ConfigSchema} from "../Schemas/config_schema/config.schema";
import {ZemsService} from "../zems/zems.service";
import { WebsocketModule } from '../websocket/websocket.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Races.name, schema: RacesSchema }]),
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Zems.name, schema: ZemsSchema }]),
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
    WebsocketModule,
    WalletModule,
  ],
  controllers: [RacesController],
  providers: [RacesService, UsersService, ZemsService],
})
export class RacesModule {}
