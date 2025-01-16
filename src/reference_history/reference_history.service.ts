import { Injectable } from '@nestjs/common';
import { CreateReferenceHistoryDto } from './dto/create-reference_history.dto';
import { UpdateReferenceHistoryDto } from './dto/update-reference_history.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ReferenceHistory } from 'src/Schemas/reference_history_schema/reference_history_schema.schema';
import { Model, Types } from 'mongoose';
import { Config } from 'src/Schemas/config_schema/config.schema';
import { WalletService } from 'src/wallet/wallet.service';
import { NotificationService } from 'src/notifications/notification.service';
import { TransactionType } from 'src/Schemas/wallet_schema/wallet_transaction.schema';

@Injectable()
export class ReferenceHistoryService {
  constructor(
    @InjectModel(ReferenceHistory.name)
    private referenceHistoryModel: Model<ReferenceHistory>,
    @InjectModel(Config.name) private configModel: Model<Config>,
    private walletService: WalletService,
  ) { }

  async createReferenceHistory(referrerId: string, referredId: string) {
    try {
      // Récupérer le montant du bonus depuis la configuration
      const bonusConfig = await this.configModel.findOne({ key: 'referal-code-bonus' }).exec();
      const bonusAmount = bonusConfig ? parseFloat(bonusConfig.value) : 20; // Valeur par défaut si non trouvée
  
      // Vérifier que bonusAmount est bien un nombre
      if (isNaN(bonusAmount)) {
        throw new Error('Le montant du bonus doit être un nombre');
      }
  
      // Créer l'historique de parrainage
      const referenceHistory = await this.referenceHistoryModel.create({
        referrer: new Types.ObjectId(referrerId),
        referred: new Types.ObjectId(referredId),
        bonus_amount: bonusAmount, // Utiliser directement le nombre
        created_at: new Date(),
        updated_at: new Date(),
      });
  
      // Créditer le wallet du parrain
      await this.walletService.creditWalletUserCustomBalance(
        referrerId,
        bonusAmount,
        'Bonus Parrainage',
        `Vous avez reçu ${bonusAmount} XOF pour avoir parrainé un nouvel utilisateur`,
        TransactionType.BONUS,
      );
  
      return referenceHistory;
    } catch (error) {
      console.error('Erreur lors de la création de l\'historique de parrainage:', error);
      throw error;
    }
  }

  async findAll() {
    return this.referenceHistoryModel
      .find()
      .populate('referrer', 'firstname lastname phone_number')
      .populate('referred', 'firstname lastname phone_number');
  }

  async findOne(id: number) {
    return this.referenceHistoryModel
      .findById(id)
      .populate('referrer', 'firstname lastname phone_number')
      .populate('referred', 'firstname lastname phone_number');
  }

  async update(id: number, updateReferenceHistoryDto: UpdateReferenceHistoryDto) {
    return this.referenceHistoryModel.findByIdAndUpdate(
      id,
      updateReferenceHistoryDto,
      { new: true }
    );
  }

  async remove(id: number) {
    return this.referenceHistoryModel.findByIdAndDelete(id);
  }

  async findByReferrerWithDetails(referrerId: string) {
    try {
      const referrals = await this.referenceHistoryModel
        .find({ referrer: new Types.ObjectId(referrerId) })
        .populate('referrer', 'firstname lastname phone_number user_profile_image sponsorship_code')
        .populate('referred', 'firstname lastname phone_number user_profile_image created_at')
        .sort({ created_at: -1 })
        .exec();
  
      const totalBonus = referrals.reduce((sum, referral) => sum + referral.bonus_amount, 0);
  
      const totalReferred = referrals.length;
  
      return {
        referrer: referrals[0]?.referrer || null,
        totalBonus,
        totalReferred,
        referrals: referrals.map(referral => ({
          referred: referral.referred,
          bonus_amount: referral.bonus_amount,
          created_at: referral.created_at
        }))
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de parrainage:', error);
      throw error;
    }
  }

  create(createReferenceHistoryDto: CreateReferenceHistoryDto) {
    return 'This action adds a new referenceHistory';
  }
}
