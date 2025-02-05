import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Config,
  ConfigDocument,
} from '../../Schemas/config_schema/config.schema';
import { GSMNumberFormat } from 'src/Schemas/gsm_number_format_schema/gsm_number_format.schema';

@Injectable()
export class GmsSeeder {
  constructor(
    @InjectModel(GSMNumberFormat.name) private gsmModel: Model<GSMNumberFormat>,
  ) { }

  async seed() {
    const tabs = [
      {
        prefix: '0142',
        operator_name: 'mtn',
      },
      {
        prefix: '0146',
        operator_name: 'mtn',
      },
      {
        prefix: '0150',
        operator_name: 'mtn',
      },
      {
        prefix: '0151',
        operator_name: 'mtn',
      },
      {
        prefix: '0152',
        operator_name: 'mtn',
      },
      {
        prefix: '0153',
        operator_name: 'mtn',
      },
      {
        prefix: '0154',
        operator_name: 'mtn',
      },
      {
        prefix: '0156',
        operator_name: 'mtn',
      },
      {
        prefix: '0157',
        operator_name: 'mtn',
      },
      {
        prefix: '0159',
        operator_name: 'mtn',
      },
      {
        prefix: '0161',
        operator_name: 'mtn',
      },
      {
        prefix: '0162',
        operator_name: 'mtn',
      },
      {
        prefix: '0166',
        operator_name: 'mtn',
      },
      {
        prefix: '0167',
        operator_name: 'mtn',
      },
      {
        prefix: '0169',
        operator_name: 'mtn',
      },
      {
        prefix: '0190',
        operator_name: 'mtn',
      },
      {
        prefix: '0191',
        operator_name: 'mtn',
      },
      {
        prefix: '0192',
        operator_name: 'mtn',
      },
      {
        prefix: '0193',
        operator_name: 'mtn',
      },
      {
        prefix: '0196',
        operator_name: 'mtn',
      },
      {
        prefix: '0197',
        operator_name: 'mtn',
      },
      {
        prefix: '0145',
        operator_name: 'moov',
      },
      {
        prefix: '0155',
        operator_name: 'moov',
      },
      {
        prefix: '0158',
        operator_name: 'moov',
      },
      {
        prefix: '0160',
        operator_name: 'moov',
      },
      {
        prefix: '0163',
        operator_name: 'moov',
      },
      {
        prefix: '0164',
        operator_name: 'moov',
      },
      {
        prefix: '0165',
        operator_name: 'moov',
      },
      {
        prefix: '0168',
        operator_name: 'moov',
      },
      {
        prefix: '0194',
        operator_name: 'moov',
      },
      {
        prefix: '0195',
        operator_name: 'moov',
      },
      {
        prefix: '0198',
        operator_name: 'moov',
      },
      {
        prefix: '0199',
        operator_name: 'moov',
      },
      {
        prefix: '0140',
        operator_name: 'celtiis',
      },
      {
        prefix: '0141',
        operator_name: 'celtiis',
      },
      {
        prefix: '0143',
        operator_name: 'celtiis',
      },
      {
        prefix: '0144',
        operator_name: 'celtiis',
      },
      {
        prefix: '0147',
        operator_name: 'celtiis',
      },
      {
        prefix: '0148',
        operator_name: 'celtiis',
      },
    ];
    const bulkOps = tabs.map((item) => ({
      updateOne: {
        filter: { prefix: item.prefix },
        update: { $set: item },
        upsert: true,
      },
    }));
    await this.gsmModel.bulkWrite(bulkOps);
  }
}
