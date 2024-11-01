import { Module } from '@nestjs/common';
import { ZemsService } from './zems.service';
import { ZemsController } from './zems.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Zems, ZemsSchema } from '../Schemas/zems_schema/Zems.schema';
import {UsersService} from "../users/users.service";
import {Users, UserSchema} from "../Schemas/users_schema/Users.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Zems.name, schema: ZemsSchema }]),
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]),
  ],
  controllers: [ZemsController],
  providers: [ZemsService, UsersService],
})
export class ZemsModule {}
