import { Injectable } from '@nestjs/common';
import { CreateGsmnumberFormatDto } from './dto/create-gsmnumber-format.dto';
import { UpdateGsmnumberFormatDto } from './dto/update-gsmnumber-format.dto';
import { Model } from 'mongoose';
import { GSMNumberFormat } from 'src/Schemas/gsm_number_format_schema/gsm_number_format.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class GSMNumberFormatService {
  constructor(
    @InjectModel(GSMNumberFormat.name)
    private gsmNumberFormatModel: Model<GSMNumberFormat>
  ) {}

  async create(prefix: string, operator_name: string) {
    const newFormat = new this.gsmNumberFormatModel({
      prefix,
      operator_name,
    });

    return await newFormat.save();
  }

  async findAll() {
    return await this.gsmNumberFormatModel.find().exec();
  }

  async isValidPrefix(phone_number: string) : Promise<boolean> {
    const prefix = phone_number.substring(4, 8);
    const format = await this.gsmNumberFormatModel.findOne({ prefix: prefix }).exec();

    console.log(prefix);
    return format !== null;
  }
}
