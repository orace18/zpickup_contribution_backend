import { Injectable } from '@nestjs/common';
import { CreateCnssDto } from './dto/create-cnss.dto';
import { UpdateCnssDto } from './dto/update-cnss.dto';

@Injectable()
export class CnssService {
  create(createCnssDto: CreateCnssDto) {
    return 'This action adds a new cnss';
  }

  findAll() {
    return `This action returns all cnss`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cnss`;
  }

  update(id: number, updateCnssDto: UpdateCnssDto) {
    return `This action updates a #${id} cnss`;
  }

  remove(id: number) {
    return `This action removes a #${id} cnss`;
  }
}
