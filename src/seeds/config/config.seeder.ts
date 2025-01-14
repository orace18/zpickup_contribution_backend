import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Config,
  ConfigDocument,
} from '../../Schemas/config_schema/config.schema';

@Injectable()
export class ConfigSeeder {
  constructor(
    @InjectModel(Config.name) private configModel: Model<ConfigDocument>,
  ) {}

  async seed() {
    const tabs = [
      {
        key: 'ray',
        value: '5',
        description: 'Rayon par defaut pour les recherches de clients ou zem',
      },
      {
        key: 'percent-share-customer',
        value: '30',
        description: 'Pourcentage de gain des clients par km',
      },
      {
        key: 'percent-share-zem',
        value: '10',
        description: 'Pourcentage de gain des zems par km',
      },
      {
        key: 'balance-minimum',
        value: '1000',
        description: 'Montant minimum à recharger',
      },
      {
        key: 'free-km',
        value: '20',
        description: 'Nombre de kilometre gratuit',
      },
      { key: 'km-price', value: '12', description: "Valeur d'un kilomètre" },
      {
        key: 'min-km',
        value: '5',
        description: 'Valeur de km minimum restant dans le compteur',
      },
      {
        key: 'customer-race-bonus',
        value: '4',
        description: 'Bonus par course terminée pour le client',
      },
      {
        key: 'zem-race-bonus',
        value: '1',
        description: 'Bonus par course terminée pour le zem',
      },
        {
        key: 'min-recharge-amount',
        value: '500',
        description: 'Montant minimum de charge du portefeuille',
      },
        {
        key: 'km-kdo-for-zem',
        value: '1',
        description: 'Activer/Desactiver le km gratuit offer aux nouveaux conducteurs',
      },

    ];
    const bulkOps = tabs.map((item) => ({
      updateOne: {
        filter: { key: item.key },
        update: { $set: item },
        upsert: true,
      },
    }));
    await this.configModel.bulkWrite(bulkOps);
  }
}
