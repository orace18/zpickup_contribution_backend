import { Module } from '@nestjs/common';
import { CounterHistoryService } from './counter-history.service';
import { CounterHistoryController } from './counter-history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CounterHistory, CounterHistorySchema } from '../Schemas/counter-history_schema/counter_history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CounterHistory.name, schema: CounterHistorySchema }])
  ],
  controllers: [CounterHistoryController],
  providers: [CounterHistoryService],
})
export class CounterHistoryModule {}