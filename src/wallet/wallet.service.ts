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
import { CreditWallet } from '../Schemas/wallet_schema/credit-wallet.schema';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
    @InjectModel(WalletTransaction.name)
    private walletTransactionModel: Model<WalletTransaction>,
    @InjectModel(CreditWallet.name)
    private creditWalletModel: Model<CreditWallet>,
    private notificationService: NotificationService,
  ) {}

  async getWalletBalance(userId: string) {
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

  async creditWalletBalance(
    userId: string,
    transaction_type: string,
    amount: number,
  ) {
    const wallet = await this.getWalletBalance(userId);

    wallet.wallet_amount += amount;
    wallet.updated_at = new Date();
    await wallet.save();

    const transaction = await this.creditWalletModel.create({
      user: new Types.ObjectId(userId),
      transaction_type,
      amount,
    });

    await this.notificationService.createNotification(
      userId,
      'Recharge Réussie',
      `Votre compte a été rechargé avec succès de ${amount} XOF. Nouveau solde: ${wallet.wallet_amount} XOF`,
      'payment_confirmation',
      {
        transactionId: transaction._id,
        amount: amount,
        newBalance: wallet.wallet_amount,
      },
    );

    return {
      message: 'Recharge effectué avec succès',
      transaction,
      new_balance: wallet.wallet_amount,
    };
  }

  async withdrawWalletBalance(
    userId: string,
    amount: number,
    phone_number: string,
    type: TransactionType.WITHDRAWAL,
    minWithdrawalAmount = 10000,
  ): Promise<{ newBalance: number; transaction: any }> {
    const wallet = await this.getWalletBalance(userId);

    if (wallet.wallet_amount < amount) {
      throw new BadRequestException('Solde insuffisant');
    }

    if (wallet.wallet_amount < minWithdrawalAmount) {
      throw new BadRequestException(
        `Vous n'avez pas encore atteint le montant minimum de retrait`,
      );
    }

    if (amount >= wallet.wallet_amount) {
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
      phone_number,
    });

    await this.notificationService.createNotification(
      userId,
      'Retrait effectué avec succès',
      `Votre avez retiré avec succès un montant de ${amount} XOF. Nouveau solde: ${wallet.wallet_amount} XOF`,
      'payment_confirmation',
      {
        transactionId: transaction._id,
        amount: amount,
        newBalance: wallet.wallet_amount,
      },
    );

    return {
      newBalance: wallet.wallet_amount,
      transaction,
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
