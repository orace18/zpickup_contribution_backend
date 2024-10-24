import { Module } from '@nestjs/common';
import { ZemsService } from './zems.service';
import { ZemsController } from './zems.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Zems, ZemsSchema } from '../Schemas/zems_schema/Zems.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Zems.name, schema: ZemsSchema }]),
  ],
  controllers: [ZemsController],
  providers: [ZemsService],
})
export class ZemsModule {}
