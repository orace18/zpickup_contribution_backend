import { Module } from '@nestjs/common';
import { ActivationHistoryService } from './activation_history.service';
import { ActivationHistoryController } from './activation_history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ActivationHistory,
  ActivationHistorySchema,
} from '../Schemas/activation_history_schema/activation_history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ActivationHistory.name, schema: ActivationHistorySchema }]),
  ],
  controllers: [ActivationHistoryController],
  providers: [ActivationHistoryService],
})
export class ActivationHistoryModule {}
