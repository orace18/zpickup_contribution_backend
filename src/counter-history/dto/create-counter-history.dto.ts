import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject, IsOptional,
} from 'class-validator';
import { Counter } from '../../Schemas/counter_schema/counter.schema';
import { CounterType } from '../../Schemas/counter-history_schema/counter_history.schema';
import {Types} from "mongoose";

export class CreateCounterHistoryDto {

  @IsNotEmpty()
  counter: Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsEnum(CounterType)
  @IsNotEmpty()
  counter_type: CounterType;

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
