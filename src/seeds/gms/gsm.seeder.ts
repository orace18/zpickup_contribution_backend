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
        prefix: '2290167',
        operator_name: 'mtn',
      },
      {
        prefix: '2290161',
        operator_name: 'mtn',
      },
      {
        prefix: '2290162',
        opertor_name: 'mtn',
      },
      {
        prefix: '2290163',
        operator_name: 'moov',
      },
      {
        prefix: '2290160',
        operator_name: 'moov',
      },
      {
        prefix: '2290196',
        operator_name: 'mtn'
      },
      {
        prefix: '2290197',
        operator_name: 'mtn'
      },
      {
        prefix: '2290166',
        operator_name: 'mtn'
      },
      {
        prefix: '2290169',
        operator_name: 'mtn'
      },
      {
        prefix: '2290153',
        operator_name: 'mtn'
      },
      {
        prefix: '2290192',
        operator_name: 'mtn'
      },
      {
        prefix: '2290151',
        operator_name: 'mtn'
      },
      {
        prefix: '2290196',
        operator_name: 'mtn'
      },
      {
        prefix: '2290152',
        operator_name: 'mtn'
      },
      {
        prefix: '2290191',
        operator_name: 'mtn'
      },
      {
        prefix: '2290154',
        operator_name: 'mtn'
      },
      {
        prefix: '2290156',
        operator_name: 'mtn'
      },
      {
        prefix: '2290157',
        operator_name: 'mtn'
      },
      {
        prefix: '2290159',
        operator_name: 'mtn'
      },
      {
        prefix: '2290190',
        operator_name: 'mtn'
      },
      {
        prefix: '2290165',
        operator_name: 'moov'
      },
      {
        prefix: '2290195',
        operator_name: 'moov'
      },
      {
        prefix: '2290194',
        operator_name: 'moov'
      },
      {
        prefix: '2290168',
        operator_name: 'moov'
      },
      {
        prefix: '2290198',
        operator_name: 'moov'
      },
      {
        prefix: '2290199',
        operator_name: 'moov'
      },
      {
        prefix: '2290155',
        operator_name: 'moov'
      },
      {
        prefix: '2290140',
        operator_name: 'celtiis'
      },
      {
        prefix: '2290142',
        operator_name: 'mtn'
      },
      {
        prefix: '2290141',
        operator_name: 'celtiis'
      },
      {
        prefix: '2290144',
        operator_name: 'celtiis'
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
        prefix: '2290193',
        operator_name: 'mtn'
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
        prefix: '2290160',
        operator_name: 'moov'
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
        prefix: '2290164',
        operator_name: 'moov'
      },
      {
        prefix: '2290187',
        operator_name: 'mtn'
      },
      {
        prefix: '2290189',
        operator_name: 'mtn'
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
