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
import { Users, UserType } from 'src/Schemas/users_schema/Users.schema';

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

      const referrer = await this.userModel
        .findById(referrerId)
        .select('user_type')
        .lean()
        .exec();

      if (!referrer) {
        throw new Error(`Parrain avec l'ID ${referrerId} introuvable`);
      }

      console.log("Type d'utilisateur du parrain:", referrer.user_type);

      if (referrer.user_type === UserType.CUSTOMER) {
        return this.handleRegularBonus(referrerId, referredId);
      }

      if (referrer.user_type === UserType.ZEM) {
        const referrerZem = await this.zemsModel
          .findOne({ user: new Types.ObjectId(referrerId) })
          .lean()
          .exec();

        if (referrerZem && referrerZem.is_ambassador === true) {
          console.log('Est ambassadeur: true');
          return this.handleAmbassadorBonus(referrerId, referredId);
        } else {
          console.log('Est ambassadeur: false');
          return this.handleRegularBonus(referrerId, referredId);
        }
      }

      throw new Error(
        `Type d'utilisateur non pris en charge: ${referrer.user_type}`,
      );
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
}
