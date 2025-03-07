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
  ) { }

  async seed() {
    const tabs = [
      {
        key: 'ray',
        value: '5',
        type: "number",
        description: 'Rayon par defaut pour les recherches de clients ou zem',
      },
      {
        key: 'percent-share-customer',
        value: '30',
        type: "number",
        description: 'Pourcentage de gain des clients par km',
      },
      {
        key: 'percent-share-zem',
        value: '10',
        type: "number",
        description: 'Pourcentage de gain des zems par km',
      },
      {
        key: 'balance-minimum',
        value: '1000',
        type: "number",
        description: 'Montant minimum à recharger',
      },
      {
        key: 'free-km',
        value: '20',
        type: "number",
        description: 'Nombre de kilometre gratuit',
      },
      { key: 'km-price', value: '12', description: "Valeur d'un kilomètre" },
      {
        key: 'min-km',
        value: '5',
        type: "number",
        description: 'Valeur de km minimum restant dans le compteur',
      },
      {
        key: 'customer-race-bonus',
        value: '4',
        type: "number",
        description: 'Bonus par course terminée pour le client',
      },
      {
        key: 'zem-race-bonus',
        value: '1',
        type: "number",
        description: 'Bonus par course terminée pour le zem',
      },
      {
        key: 'min-recharge-amount',
        value: '500',
        type: "number",
        description: 'Montant minimum de charge du portefeuille',
      },
      {
        key: 'km-kdo-for-zem',
        value: '1',
        type: "number",
        description: 'Activer/Desactiver le km gratuit offer aux nouveaux conducteurs',
      },
      {
        key: 'referal-code-bonus',
        value: '20',
        type: "number",
        description: 'Bonus par parrainage',
      },
      {
        key: 'referal-1-title',
        value: 'Etape 1: Partagez votre code de parrainage',
        type: "string",
        description: 'titre de l\'etape 1',
      },
      {
        key: 'referal-2-title',
        value: 'Etape 2: Votre ami active son compte',
        type: "string",
        description: 'titre de l\'etape 2',
      },
      {
        key: 'referal-3-title',
        value: 'Etape 3: Recevez XX F CFA pour de l\'inscription de votre ami',
        type: "string",
        description: 'titre de l\'etape 3',
      },
      {
        key: 'referal-4-title',
        value: 'Etape 4: Recevez XX F CFA pour les 5 premières courses effectuées par votre ami',
        type: "string",
        description: 'titre de l\'etape 4',
      },
      {
        key: 'referal-1-description',
        value: 'Description: Vous pouvez inviter des amis qui sont nouveaux ou reviennent sur ZPickUp',
        type: "string",
        description: 'description de l\'etape 1',
      },
      {
        key: 'referal-2-description',
        value: 'Description: Votre amis sera redirige sur l\'application pour creer et activer sont compte ZPickUp',
        type: "string",
        description: 'description de l\'etape 2',
      },
      {
        key: 'monthly-km-for-ambassador',
        value: '100',
        type: 'number',
        description: 'Nombre de kilomètres offerts chaque mois aux ambassadeurs',
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
