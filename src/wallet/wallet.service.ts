import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet } from '../Schemas/wallet_schema/wallet.schema';
import {
  TransactionType,
  WalletTransaction,
} from '../Schemas/wallet_schema/wallet_transaction.schema';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
    @InjectModel(WalletTransaction.name)
    private walletTransactionModel: Model<WalletTransaction>,
  ) {}

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
    return wallet;
  }

  async creditWallet(userId: string, amount: number) {
    const wallet = await this.getBalance(userId);

    wallet.wallet_amount += amount;
    wallet.updated_at = new Date();
    await wallet.save();

    const transaction = await this.walletTransactionModel.create({
      user: new Types.ObjectId(userId),
      amount,
    });

    return {
      message: 'Recharge effectué avec succès',
      transaction,
      new_balance: wallet.wallet_amount,
    };
  }

  async withdrawWalletBalance(
    userId: string,
    amount: number,
    phoneNumber: string,
    type: TransactionType.WITHDRAWAL,
    minWithdrawalAmount = 10000,
  ): Promise<{ newBalance: number; transaction: any }> {
    const wallet = await this.getBalance(userId);

    if (wallet.wallet_amount < amount) {
      throw new BadRequestException('Solde insuffisant');
    }

    if (amount < minWithdrawalAmount) {
      throw new BadRequestException(
        `Vous n'avez pas encore atteint le montant minimum de retrait`,
      );
    }

    if (amount > wallet.wallet_amount) {
      throw new BadRequestException(
        `Vous ne pouvez pas tout retirer sur le compte. Veuillez choisir un montant raisonnable à retirer pour le moment`,
      );
    }

    wallet.wallet_amount -= amount;
    wallet.updated_at = new Date();
    await wallet.save();

    const transaction = await this.walletTransactionModel.create({
      user: new Types.ObjectId(userId),
      amount,
      type,
      phoneNumber,
    });

    return {
      newBalance: wallet.wallet_amount,
      transaction,
    };
  }

  async getTransactionHistory(userId: string) {
    const transactions = await this.walletTransactionModel
      .find({
        user: new Types.ObjectId(userId),
      })
      .sort({ created_at: -1 })
      .lean()
      .exec();

    return {
      total_transactions: transactions.length,
      total_amount: transactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0,
      ),
      transactions: transactions.map((transaction) => ({
        amount: transaction.amount,
        phone_number: transaction.phone_number,
        created_at: transaction.created_at,
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
