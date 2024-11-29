import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {Config, ConfigDocument} from '../../Schemas/config_schema/config.schema';

@Injectable()
export class ConfigSeeder {
    constructor(@InjectModel(Config.name) private configModel: Model<ConfigDocument>) {}

    async seed() {
        const tabs = [
            {key: 'ray', value: '5', description: 'Rayon par defaut pour les recherches de clients ou zem'},
            {key: 'percent-share-customer', value: '30', description: 'Pourcentage de gain des clients par km'},
            {key: 'percent-share-zem', value: '10', description: 'Pourcentage de gain des zems par km'},
        ];
        const bulkOps = tabs.map(item => ({
            updateOne: {
                filter: { key: item.key },
                update: { $set: item },
                upsert: true,
            },
        }));
        await this.configModel.bulkWrite(bulkOps);
    }
}
