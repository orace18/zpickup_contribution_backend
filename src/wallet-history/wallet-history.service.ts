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

  async getTransactionHistory(userId: string) {
    /* Récupérer les retraits */
    const withdrawals = await this.walletTransactionModel
      .find({
        user: new Types.ObjectId(userId),
      })
      .sort({ created_at: -1 })
      .lean()
      .exec();

    /* Récupérer les crédits */
    const credits = await this.creditWalletModel
      .find({
        user: new Types.ObjectId(userId),
      })
      .sort({ created_at: -1 })
      .lean()
      .exec();

    /* Combiner et trier les transactions par date */
    const allTransactions = [
      ...withdrawals.map((tx) => ({
        amount: tx.amount,
        phone_number: tx.phone_number,
        created_at: tx.created_at,
        type: 'withdrawal',
      })),
      ...credits.map((tx) => ({
        amount: tx.amount,
        transaction_type: tx.transaction_type,
        created_at: tx.created_at,
        type: 'credit',
      })),
    ].sort((a, b) => {
      const dateA =
        a.created_at instanceof Date ? a.created_at : new Date(a.created_at);
      const dateB =
        b.created_at instanceof Date ? b.created_at : new Date(b.created_at);
      return dateB.getTime() - dateA.getTime();
    });

    return {
      total_transactions: allTransactions.length,
      total_withdrawals: withdrawals.length,
      total_credits: credits.length,
      total_withdrawal_amount: withdrawals.reduce(
        (sum, tx) => sum + tx.amount,
        0,
      ),
      total_credit_amount: credits.reduce((sum, tx) => sum + tx.amount, 0),
      transactions: allTransactions,
    };
  }

  create(createWalletHistoryDto: CreateWalletHistoryDto) {
    return 'This action adds a new walletHistory';
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
