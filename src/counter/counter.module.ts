import { Module } from '@nestjs/common';
import { CounterService } from './counter.service';
import { CounterController } from './counter.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Counter, CounterSchema } from '../Schemas/counter_schema/counter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Counter.name, schema: CounterSchema }])
  ],
  controllers: [CounterController],
  providers: [CounterService],
})
export class CounterModule {}
