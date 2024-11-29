import { Injectable } from '@nestjs/common';
import { CreateActivationHistoryDto } from './dto/create-activation_history.dto';
import { UpdateActivationHistoryDto } from './dto/update-activation_history.dto';

@Injectable()
export class ActivationHistoryService {
  create(createActivationHistoryDto: CreateActivationHistoryDto) {
    return 'This action adds a new activationHistory';
  }

  findAll() {
    return `This action returns all activationHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} activationHistory`;
  }

  update(id: number, updateActivationHistoryDto: UpdateActivationHistoryDto) {
    return `This action updates a #${id} activationHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} activationHistory`;
  }
}
