// src/zems/services/zem-validation.service.ts
import { Injectable } from '@nestjs/common';
import { ZemsService } from './zems.service';
import { CounterService } from '../counter/counter.service';
import { UsersService } from '../users/users.service';
import { NotificationService } from '../notifications/notification.service';
import { ProfileValidationStatus, Zems } from '../Schemas/zems_schema/Zems.schema';
import { sendNotification } from "../services/helpers.service";
import { InjectModel } from '@nestjs/mongoose';
import { Config } from 'src/Schemas/config_schema/config.schema';
import { Model } from 'mongoose';
import { WalletService } from 'src/wallet/wallet.service';
import { TransactionType } from 'src/Schemas/wallet_schema/wallet_transaction.schema';
import { Users } from 'src/Schemas/users_schema/Users.schema';

@Injectable()
export class ZemValidationService {
  constructor(
    private readonly zemsService: ZemsService,
    private readonly counterService: CounterService,
    private readonly userService: UsersService,
    @InjectModel(Config.name) private configModel: Model<Config>,
    @InjectModel(Users.name) private userModel: Model<Users>,
    @InjectModel(Zems.name) private zemModel: Model<Zems>,
    private readonly walletService: WalletService,
  ) { }

  private async handleAmbassadorBonus(affiliatedUserId: string) {
    try {
      // 1. Récupérer l'utilisateur affilié avec son referal_code
      const affiliatedUser = await this.userModel
        .findOne({ _id: affiliatedUserId })
        .select('referal_code')
        .exec();

      console.log('Code de parrainage du filleul:', affiliatedUser?.referal_code);

      // 2. Trouver l'utilisateur parrain qui a ce sponsorship_code
      const parrainUser = await this.userModel
        .findOne({ sponsorship_code: affiliatedUser.referal_code })
        .populate('zem') // On récupère directement l'ID du zem du parrain
        .exec();

      console.log('Zem ID du parrain:', parrainUser?.zem);

      if (!parrainUser?.zem) {
        console.log('Zem du parrain non trouvé');
        return;
      }

      // 3. Vérifier si ce Zem est ambassadeur
      const ambassadorZem = await this.zemModel
        .findOne({ 
          _id: parrainUser.zem,
          is_ambassador: true 
        })
        .exec();

      console.log('Statut ambassadeur vérifié:', ambassadorZem);

      if (!ambassadorZem) {
        console.log('Le Zem n\'est pas un ambassadeur');
        return;
      }

      // 4. Récupérer le montant du bonus
      const zemBonusConfig = await this.configModel
        .findOne({ key: 'ambassador-zem-affiliation-bonus' })
        .exec();

      if (!zemBonusConfig) {
        console.log('Configuration du bonus non trouvée');
        return;
      }

      const bonusAmount = parseFloat(zemBonusConfig.value);

      // 5. Créditer le bonus au portefeuille ambassadeur
      await this.walletService.creditWalletUserCustomBalance(
        parrainUser._id.toString(),
        bonusAmount,
        'Bonus Validation Zem',
        `Bonus pour la validation du compte Zem de votre filleul - ${bonusAmount} XOF`,
        TransactionType.BONUS_AMBASSADOR_ZEM,
        'ambassador'
      );

      console.log(`Bonus de ${bonusAmount} XOF crédité au portefeuille ambassadeur de ${parrainUser._id}`);
    } catch (error) {
      console.error('Erreur lors du traitement du bonus ambassadeur:', error);
    }
}

  async validateZem(zemId: string) {
    try {
      // 1. Valider le Zem
      const updatedZem = await this.zemsService.update(zemId, {
        profile_validation_status: ProfileValidationStatus.VALIDATED,
        validated_at: new Date(),
        is_temporal: false,
      });

      // 2. Créer le compteur
      const counter = await this.counterService.createCounter(zemId);

      // 3. Récupérer le Zem complet avec les infos utilisateur
      const zem = await this.zemModel
        .findOne({ _id: zemId })
        .populate('user')
        .lean()
        .exec();

      // 4. Traiter le bonus ambassadeur si applicable
      await this.handleAmbassadorBonus(zem.user._id.toString());

      // 5. Envoyer la notification
      const user = await this.userService.findOne(zem.user._id.toString());
      if (user?.fcm_token) {
        sendNotification(
          'Course',
          'Votre compte conducteur a été validé',
          user.fcm_token,
          { more_action: '' }
        );
      }

      return {
        zem: updatedZem,
        counter: counter,
      };
    } catch (error) {
      console.error('Erreur lors de la validation du Zem:', error);
      throw error;
    }
  }
}
