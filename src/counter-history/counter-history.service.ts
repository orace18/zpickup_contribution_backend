import { Injectable } from '@nestjs/common';
import { CreateCounterHistoryDto } from './dto/create-counter-history.dto';
import { UpdateCounterHistoryDto } from './dto/update-counter-history.dto';

@Injectable()
export class CounterHistoryService {
  create(createCounterHistoryDto: CreateCounterHistoryDto) {
    return 'This action adds a new counterHistory';
  }

  findAll() {
    return `This action returns all counterHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} counterHistory`;
  }

  update(id: number, updateCounterHistoryDto: UpdateCounterHistoryDto) {
    return `This action updates a #${id} counterHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} counterHistory`;
  }
}
