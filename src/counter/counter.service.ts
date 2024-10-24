import { Injectable } from '@nestjs/common';
import { CreateCounterDto } from './dto/create-counter.dto';
import { UpdateCounterDto } from './dto/update-counter.dto';

@Injectable()
export class CounterService {
  create(createCounterDto: CreateCounterDto) {
    return 'This action adds a new counter';
  }

  findAll() {
    return `This action returns all counter`;
  }

  findOne(id: number) {
    return `This action returns a #${id} counter`;
  }

  update(id: number, updateCounterDto: UpdateCounterDto) {
    return `This action updates a #${id} counter`;
  }

  remove(id: number) {
    return `This action removes a #${id} counter`;
  }
}
