import { Module } from '@nestjs/common';
import { PenaltiesService } from './penalties.service';
import { PenaltiesController } from './penalties.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Penalties,
  PenaltySchema,
} from '../Schemas/penalties_schema/penalties.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Penalties.name, schema: PenaltySchema },
    ]),
  ],
  controllers: [PenaltiesController],
  providers: [PenaltiesService],
})
export class PenaltiesModule {}
