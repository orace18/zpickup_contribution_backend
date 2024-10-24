import { Injectable } from '@nestjs/common';
import { CreateZemDto } from './dto/create-zem.dto';
import { UpdateZemDto } from './dto/update-zem.dto';

@Injectable()
export class ZemsService {
  create(createZemDto: CreateZemDto) {
    return 'This action adds a new zem';
  }

  findAll() {
    return `This action returns all zems`;
  }

  findOne(id: string) {
    return `This action returns a #${id} zem`;
  }

  update(id: string, updateZemDto: UpdateZemDto) {
    return `This action updates a #${id} zem`;
  }

  remove(id: string) {
    return `This action removes a #${id} zem`;
  }
}
