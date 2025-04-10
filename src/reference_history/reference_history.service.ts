import { Injectable } from '@nestjs/common';
import { UpdateReferenceHistoryDto } from './dto/update-reference_history.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ReferenceHistory } from 'src/Schemas/reference_history_schema/reference_history_schema.schema';
import { Model, Types } from 'mongoose';
import { Config } from 'src/Schemas/config_schema/config.schema';
import { WalletService } from 'src/wallet/wallet.service';
import { TransactionType } from 'src/Schemas/wallet_schema/wallet_transaction.schema';
import { Zems } from 'src/Schemas/zems_schema/Zems.schema';
import { CoursesStatus, Races } from 'src/Schemas/races_schema/races.schema';
import { Users } from 'src/Schemas/users_schema/Users.schema';

@Injectable()
export class ReferenceHistoryService {
  constructor(
    @InjectModel(ReferenceHistory.name)
    private referenceHistoryModel: Model<ReferenceHistory>,
    @InjectModel(Config.name) private configModel: Model<Config>,
    @InjectModel(Zems.name) private zemsModel: Model<Zems>,
    @InjectModel(Races.name) private racesModel: Model<Races>,
    @InjectModel(Users.name) private userModel: Model<Users>,
    private walletService: WalletService,
  ) {}

  async createReferenceHistory(referrerId: string, referredId: string) {
    try {
      console.log('ReferrerId:', referrerId);
      const referrerZem = await this.zemsModel
        .findOne({
          $or: [
            { user: referrerId }, // Recherche avec la chaîne
            { user: new Types.ObjectId(referrerId) }, // Recherche avec ObjectId
          ],
        })
        .lean()
        .exec();

      console.log('Zem trouvé:', referrerZem);

      const isAmbassador = referrerZem?.is_ambassador === true;
      console.log('Est ambassadeur:', isAmbassador);

      if (isAmbassador) {
        return this.handleAmbassadorBonus(referrerId, referredId);
      } else {
        return this.handleRegularBonus(referrerId, referredId);
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      throw error;
    }
  }

  private async handleAmbassadorBonus(referrerId: string, referredId: string) {
    const ambassadorBonusConfig = await this.configModel
      .findOne({ key: 'ambassador-customer-affiliation-bonus' })
      .exec();

    console.log('Configuration bonus ambassadeur:', ambassadorBonusConfig);

    const referenceHistory = await this.referenceHistoryModel.create({
      referrer: new Types.ObjectId(referrerId),
      referred: new Types.ObjectId(referredId),
      bonus_amount: parseFloat(ambassadorBonusConfig.value),
      is_ambassador_referral: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await this.walletService.creditWalletUserCustomBalance(
      referrerId,
      parseFloat(ambassadorBonusConfig.value),
      'Bonus Affiliation Ambassadeur',
      `Bonus d'affiliation client - ${ambassadorBonusConfig.value} XOF`,
      TransactionType.BONUS,
      'ambassador',
    );

    return referenceHistory;
  }

  private async handleRegularBonus(referrerId: string, referredId: string) {
    const regularBonusConfig = await this.configModel
      .findOne({ key: 'referal-code-bonus' })
      .exec();

    const referenceHistory = await this.referenceHistoryModel.create({
      referrer: new Types.ObjectId(referrerId),
      referred: new Types.ObjectId(referredId),
      bonus_amount: parseFloat(regularBonusConfig.value),
      is_ambassador_referral: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await this.walletService.creditWalletUserCustomBalance(
      referrerId,
      parseFloat(regularBonusConfig.value),
      'Bonus Parrainage',
      `Bonus de parrainage standard - ${regularBonusConfig.value} XOF`,
      TransactionType.BONUS,
      'user',
    );

    return referenceHistory;
  }

  async getReferralDetails(referrerId: string) {
    const referrerZem = await this.zemsModel
      .findOne({ user: new Types.ObjectId(referrerId) })
      .exec();

    const referrals = await this.referenceHistoryModel
      .find({
        referrer: new Types.ObjectId(referrerId),
        ...(referrerZem?.is_ambassador ? { is_ambassador_referral: true } : {}),
      })
      .populate({
        path: 'referred',
        select: 'firstname lastname phone_number user_type',
      })
      .lean();

    const detailedReferrals = await Promise.all(
      referrals.map(async (referral) => {
        const completedRaces = await this.racesModel.countDocuments({
          user: referral.referred._id,
          status: CoursesStatus.END,
        });

        const requiredRaces = parseInt(
          (
            await this.configModel.findOne({
              key: 'ambassador-required-races',
            })
          ).value,
        );

        return {
          ...referral,
          completed_races: completedRaces,
          progress_percentage: (completedRaces / requiredRaces) * 100,
          is_goal_reached: completedRaces >= requiredRaces,
        };
      }),
    );

    return detailedReferrals;
  }

  async findAll() {
    return this.referenceHistoryModel
      .find()
      .populate('referrer', 'firstname lastname phone_number user_type')
      .populate('referred', 'firstname lastname phone_number user_type');
  }

  async findOne(id: number) {
    return this.referenceHistoryModel
      .findById(id)
      .populate('referrer', 'firstname lastname phone_number user_type')
      .populate('referred', 'firstname lastname phone_number user_type');
  }

  async findOneWithReferrer(conditions: any) {
    return this.referenceHistoryModel
      .findOne(conditions)
      .populate({
        path: 'referrer',
        select: '_id',
      })
      .exec();
  }

  async update(
    id: number,
    updateReferenceHistoryDto: UpdateReferenceHistoryDto,
  ) {
    return this.referenceHistoryModel.findByIdAndUpdate(
      id,
      updateReferenceHistoryDto,
      { new: true },
    );
  }

  async findByIdAndUpdate(id: string, updateData: Partial<ReferenceHistory>) {
    return this.referenceHistoryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async remove(id: number) {
    return this.referenceHistoryModel.findByIdAndDelete(id);
  }

  async findByReferrerWithDetails(referrerId: string) {
    try {
      const referrals = await this.referenceHistoryModel
        .find({ referrer: new Types.ObjectId(referrerId) })
        .populate(
          'referred',
          'firstname lastname phone_number user_profile_image created_at user_type',
        )
        .sort({ created_at: -1 })
        .exec();

      return referrals;
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des détails de parrainage:',
        error,
      );
      throw error;
    }
  }

  async getReferralStats(referrerId: string) {
    try {
      const referrals = await this.referenceHistoryModel
        .find({ referrer: new Types.ObjectId(referrerId) })
        .select('bonus_amount')
        .exec();

      const totalBonus = referrals.reduce(
        (sum, referral) => sum + referral.bonus_amount,
        0,
      );
      const totalReferred = referrals.length;

      return {
        totalBonus,
        totalReferred,
      };
    } catch (error) {
      console.error(
        'Erreur lors du calcul des statistiques de parrainage:',
        error,
      );
      throw error;
    }
  }

  create() {
    return 'This action adds a new referenceHistory';
  }

  async checkAndRewardAmbassadorForCustomer(user: Users) {
    console.log('Vérification récompense ambassadeur pour client:', user._id);

    // Vérifier si le client a été affilié par un ambassadeur
    const referenceHistory = await this.referenceHistoryModel
      .findOne({
        referred: user._id,
        is_ambassador_referral: true,
      })
      .populate('referrer')
      .lean()
      .exec();

    if (!referenceHistory) {
      console.log("Pas d'ambassadeur trouvé pour ce client");
      return; // Pas d'ambassadeur
    }

    console.log('Ambassadeur trouvé:', referenceHistory.referrer._id);

    // Récupérer les configurations nécessaires
    const customerRequiredRaces = await this.configModel
      .findOne({ key: 'ambassador-customer-required-races' })
      .exec();
    const customerBonus = await this.configModel
      .findOne({ key: 'ambassador-customer-races-bonus' })
      .exec();

    // Récupérer le nombre de courses actuel depuis la base de données
    const currentUser = await this.userModel.findById(user._id).exec();
    const userRacesCount = parseInt(currentUser.user_races_count || '0');
    const requiredRaces = parseInt(customerRequiredRaces.value);

    console.log(
      `Courses client: ${userRacesCount}, Seuil requis: ${requiredRaces}`,
    );

    // Vérifier si le nombre de courses est strictement egale au seuil requis
    if (userRacesCount === requiredRaces) {
      console.log("Seuil atteint! Attribution du bonus à l'ambassadeur");

      // Octroyer le bonus à l'ambassadeur
      await this.walletService.creditWalletUserCustomBalance(
        referenceHistory.referrer._id.toString(),
        parseFloat(customerBonus.value),
        'Bonus Course Client Affilié',
        `Bonus pour ${userRacesCount} courses effectuées par votre client affilié - ${customerBonus.value} XOF`,
        TransactionType.BONUS_LIMIT_CUSTOMER_RACES,
        'ambassador',
      );

      console.log('Bonus attribué avec succès!');
    }
  }

  async checkAndRewardAmbassadorForZem(zemUser: Users) {
    console.log('Vérification récompense ambassadeur pour zem:', zemUser._id);

    // Vérifier si l'utilisateur est un zem
    if (zemUser.user_type !== 'zem') {
      console.log("L'utilisateur n'est pas un zem");
      return;
    }

    // Vérifier si le zem a été affilié par un ambassadeur
    const referenceHistory = await this.referenceHistoryModel
      .findOne({
        referred: zemUser._id,
        is_ambassador_referral: true,
      })
      .populate('referrer')
      .lean()
      .exec();

    if (!referenceHistory) {
      console.log("Pas d'ambassadeur trouvé pour ce zem");
      return;
    }

    console.log('Ambassadeur trouvé:', referenceHistory.referrer._id);

    // Récupérer les configurations nécessaires
    const zemRequiredRaces = await this.configModel
      .findOne({ key: 'ambassador-zem-required-races' })
      .exec();
    const zemBonus = await this.configModel
      .findOne({ key: 'ambassador-zem-races-bonus' })
      .exec();

    // Récupérer le nombre de courses actuel depuis la base de données
    const zem = await this.zemsModel
      .findById(zemUser.zem)
      .select('zem_races_count')
      .lean()
      .exec();

    const zemRacesCount = parseInt(zem?.zem_races_count || '0');
    const requiredRaces = parseInt(zemRequiredRaces.value);

    console.log(
      `Courses zem: ${zemRacesCount}, Seuil requis: ${requiredRaces}`,
    );

    // Vérifier si le nombre de courses est strictement égal au seuil requis
    if (zemRacesCount === requiredRaces) {
      console.log(
        "Seuil atteint exactement! Attribution du bonus à l'ambassadeur",
      );

      // Octroyer le bonus à l'ambassadeur
      await this.walletService.creditWalletUserCustomBalance(
        referenceHistory.referrer._id.toString(),
        parseFloat(zemBonus.value),
        'Bonus Course Zem Affilié',
        `Bonus pour ${zemRacesCount} courses effectuées par votre zem affilié - ${zemBonus.value} XOF`,
        TransactionType.BONUS_LIMIT_ZEM_RACES,
        'ambassador',
      );

      console.log('Bonus attribué avec succès!');
    }
  }
}
