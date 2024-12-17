import { Injectable } from '@nestjs/common';
import { CreateZemDto } from './dto/create-zem.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Zems } from '../Schemas/zems_schema/Zems.schema';
import { Model } from 'mongoose';

@Injectable()
export class ZemsService {
  constructor(@InjectModel(Zems.name) private readonly zemModel: Model<Zems>) {}

  create(createZemDto: CreateZemDto) {
    const created = new this.zemModel(createZemDto);
    return created.save();
  }

  findAll() {
    return this.zemModel.find();
  }

  findOne(id: string) {
    return this.zemModel.findById(id).exec();
  }

  update(id: string, updateData: Partial<Zems>) {
    return this.zemModel.findByIdAndUpdate(id, updateData).exec();
  }

  remove(id: string) {
    return `This action removes a #${id} zem`;
  }
}
