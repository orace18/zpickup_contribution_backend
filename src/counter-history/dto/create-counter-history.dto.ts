import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { Counter } from '../../Schemas/counter_schema/counter.schema';
import { CounterType } from '../../Schemas/counter-history_schema/counter_history.schema';

export class CreateCounterHistoryDto {
  @IsObject()
  @IsNotEmpty()
  counter: Counter

  @IsNotEmpty()
  @IsNumber()
  value: number

  @IsEnum(CounterType)
  @IsNotEmpty()
  counter_type: CounterType

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
