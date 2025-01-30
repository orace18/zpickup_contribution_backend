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
        prefix: '0140',
        operator_name: 'celtiis',
      },
      {
        prefix: '0162',
        operator_name: 'mtn',
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
