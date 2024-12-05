import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Config } from '../Schemas/config_schema/config.schema';
import { Model, Types } from 'mongoose';
import { Wallet } from '../Schemas/wallet_schema/wallet.schema';
import { UserType } from '../Schemas/users_schema/Users.schema';
import {
  TransactionType,
  WalletTransaction,
} from '../Schemas/wallet_schema/wallet_transaction.schema';
import { WithdrawWalletDto } from './dto/withdraw-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Config.name) private configModel: Model<Config>,
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
    @InjectModel(WalletTransaction.name)
    private walletTransactionModel: Model<WalletTransaction>,
  ) {}

  async addRaceBonus(userId: string, userType: UserType): Promise<void> {
    try {
      const bonusConfig = await this.configModel.findOne({
        key:
          userType === UserType.CUSTOMER
            ? 'customer-race-bonus'
            : 'zem-race-bonus',
      });

      const bonusAmount = parseFloat(bonusConfig.value);

      let wallet = await this.walletModel.findOne({
        user: new Types.ObjectId(userId),
      });

      if (!wallet) {
        /* Créer un nouveau portefeuille si inexistant */
        wallet = new this.walletModel({
          user: new Types.ObjectId(userId),
          wallet_amount: 0,
        });
      }

      /* Ajouter le bonus au montant existant */
      wallet.wallet_amount += bonusAmount;
      wallet.updated_at = new Date();

      await wallet.save();

      console.log(
        `Bonus de ${bonusAmount} XOF ajouté au portefeuille de l'utilisateur ${userId}`,
      );
    } catch (e) {
      console.error("Erreur lors de l'ajout du bonus:", e);
      throw e;
    }
  }

  async getBalance(userId: string) {
    let wallet = await this.walletModel.findOne({
      user: new Types.ObjectId(userId),
    });

    if (!wallet) {
      wallet = await this.walletModel.create({
        user: new Types.ObjectId(userId),
        wallet_amount: 0,
      });
    }

    return {
      balance: wallet.wallet_amount,
    };
  }

  async withdraw(userId: string, withdrawWalletDto: WithdrawWalletDto) {
    const wallet = await this.walletModel.findOne({
      user: new Types.ObjectId(userId),
    });

    if (!wallet) {
      throw new NotFoundException('Portefeuille non trouvé');
    }

    if (wallet.wallet_amount < withdrawWalletDto.amount) {
      throw new BadRequestException('Solde insuffisant');
    }

    if (withdrawWalletDto.amount < 10000) {
      throw new BadRequestException(
        'Le montant minimum de retrait est de 10.000 XOF',
      );
    }

    /* Créer la transaction de retrait */
    const transaction = await this.walletTransactionModel.create({
      user: new Types.ObjectId(userId),
      amount: withdrawWalletDto.amount,
      type: TransactionType.WITHDRAWAL,
      phone_number: withdrawWalletDto.phone_number,
    });

    /* Mettre à jour le solde */
    wallet.wallet_amount -= withdrawWalletDto.amount;
    await wallet.save();

    return {
      message: 'Retrait effectué avec succès',
      transaction: transaction,
      new_balance: wallet.wallet_amount,
    };
  }

  async getBonusHistory(userId: string) {
    const bonuses = await this.walletTransactionModel
      .find({
        user: new Types.ObjectId(userId),
        type: TransactionType.BONUS,
      })
      .populate('race', 'reference')
      .sort({ created_at: -1 })
      .lean()
      .exec();

    return {
      total_bonuses: bonuses.length,
      total_amount: bonuses.reduce((sum, bonus) => sum + bonus.amount, 0),
      bonuses: bonuses.map((bonus) => ({
        amount: bonus.amount,
        race_reference: bonus.race?.reference,
        created_at: bonus.created_at,
      })),
    };
  }

  async getWithdrawalHistory(userId: string) {
    const withdrawals = await this.walletTransactionModel
      .find({
        user: new Types.ObjectId(userId),
        type: TransactionType.WITHDRAWAL,
      })
      .sort({ created_at: -1 })
      .lean()
      .exec();

    return {
      total_withdrawals: withdrawals.length,
      total_amount: withdrawals.reduce(
        (sum, withdrawal) => sum + withdrawal.amount,
        0,
      ),
      withdrawals: withdrawals.map((withdrawal) => ({
        amount: withdrawal.amount,
        phone_number: withdrawal.phone_number,
        created_at: withdrawal.created_at,
      })),
    };
  }

  create(createWalletDto: CreateWalletDto) {
    return 'This action adds a new wallet';
  }

  findAll() {
    return `This action returns all wallet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
