import { Injectable } from '@nestjs/common';
import { CreateWalletHistoryDto } from './dto/create-wallet-history.dto';
import { UpdateWalletHistoryDto } from './dto/update-wallet-history.dto';
import { InjectModel } from '@nestjs/mongoose';
import { WalletTransaction } from '../Schemas/wallet_schema/wallet_transaction.schema';
import { Model, Types } from 'mongoose';
import { CreditWallet } from '../Schemas/wallet_schema/credit-wallet.schema';

@Injectable()
export class WalletHistoryService {
  constructor(
    @InjectModel(WalletTransaction.name)
    private walletTransactionModel: Model<WalletTransaction>,
    @InjectModel(CreditWallet.name)
    private creditWalletModel: Model<CreditWallet>,
  ) {}

  /*  async getTransactionHistory(userId: string, type: string = 'user') {
    const withdrawals = await this.walletTransactionModel
      .find({
        user: new Types.ObjectId(userId),
        wallet_type: type 
      })
      .sort({ created_at: -1 })
      .lean()
      .exec();
    return withdrawals;
  } */

  async getTransactionHistory(userId: string, type: string = 'user') {
    const withdrawals = await this.walletTransactionModel
      .find({
        user: new Types.ObjectId(userId),
        wallet_type: type,
      })
      .populate({
        path: 'referred',
        select: 'firstname lastname user_type created_at',
        model: 'Users'
      })
      .sort({ created_at: -1 })
      .lean()
      .exec();

    return withdrawals.map(transaction => ({
      ...transaction,
      formatted_date: new Date(transaction.created_at).toLocaleString('fr-FR', {
        timeZone: 'Africa/Porto-Novo'
      })
    }));
  }

  async create(createWalletHistoryDto: CreateWalletHistoryDto) {
    const newWalletHistory = new this.walletTransactionModel({
      ...createWalletHistoryDto,
      created_at: new Date(),
    });

    return await newWalletHistory.save();
  }

  findAll() {
    return `This action returns all walletHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} walletHistory`;
  }

  update(id: number, updateWalletHistoryDto: UpdateWalletHistoryDto) {
    return `This action updates a #${id} walletHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} walletHistory`;
  }
}
