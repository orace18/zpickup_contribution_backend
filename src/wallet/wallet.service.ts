import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet } from '../Schemas/wallet_schema/wallet.schema';
import {
  TransactionType,
  WalletTransaction,
} from '../Schemas/wallet_schema/wallet_transaction.schema';
import { CreditWallet } from '../Schemas/wallet_schema/credit-wallet.schema';
import { NotificationService } from '../notifications/notification.service';
import { UsersService } from '../users/users.service';
import { sendNotification } from '../services/helpers.service';
import { CreditWalletDto } from './dto/credit-wallet.dto';
import { Zems } from 'src/Schemas/zems_schema/Zems.schema';
import { create } from 'node:domain';
import { WithdrawStatus } from '../Schemas/wallet_schema/withdraw-status.enum';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
    @InjectModel(WalletTransaction.name)
    private walletTransactionModel: Model<WalletTransaction>,
    @InjectModel(CreditWallet.name)
    private creditWalletModel: Model<CreditWallet>,
    @InjectModel(Zems.name) private zemsModel: Model<Zems>,
    private notificationService: NotificationService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async getWalletBalance(userId: string, type: string = 'user') {
    let wallet = await this.walletModel.findOne({
      user: new Types.ObjectId(userId),
      type: type,
    });

    if (!wallet) {
      // Créer le portefeuille demandé pour le parrain
      wallet = await this.walletModel.create({
        user: new Types.ObjectId(userId),
        type: type,
        wallet_amount: 0,
        created_at: new Date(),
        updated_at: new Date(),
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

    wallet.wallet_amount = Number(wallet.wallet_amount) + Number(amount);
    wallet.updated_at = new Date();
    wallet.created_at = new Date();
    await wallet.save();

    console.log('wallet', wallet);

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

    const user = await this.userService.findOne(userId);
    if (user.fcm_token) {
      const send_data = {
        _id: user._id.toString(),
        more_action: 'credited',
      };
      sendNotification(
        'Recharge Réussie',
        'Vous venez de recharger votre portefeuille avec succès',
        user.fcm_token,
        send_data,
      );
    }

    return {
      message: 'Recharge effectué avec succès',
      transaction,
      new_balance: wallet.wallet_amount,
    };
  }

  async creditWalletUserCustomBalance(
    userId: string,
    amount: number,
    title: string,
    msg: string,
    type: TransactionType,
    wallet_type: string = 'user',
    referredId?: string,
  ) {
    const wallet = await this.getWalletBalance(userId, wallet_type);

    switch (type) {
      case TransactionType.BONUS:
      case TransactionType.WITHDRAWAL:
      case TransactionType.BONUS_AMBASSADOR_CLIENT:
      case TransactionType.BONUS_AMBASSADOR_ZEM:
      case TransactionType.BONUS_LIMIT_CUSTOMER_RACES:
      case TransactionType.BONUS_LIMIT_ZEM_RACES:
        wallet.wallet_amount = Number(wallet.wallet_amount) + Number(amount);
        break;
      case TransactionType.DEBIT:
        wallet.wallet_amount = Number(wallet.wallet_amount) - Number(amount);
        break;
      default:
        throw new BadRequestException('Type de transaction non supporté');
    }

    wallet.updated_at = new Date();
    await wallet.save();

    const transactionData: any = {
      user: new Types.ObjectId(userId),
      amount: amount,
      type: type,
      wallet_type: wallet_type,
      created_at: new Date(),
      updated_at: new Date(),
    };

    if (referredId) {
      transactionData.referred = new Types.ObjectId(referredId);
    }

    const transaction =
      await this.walletTransactionModel.create(transactionData);

    await this.notificationService.createNotification(
      userId,
      title,
      msg,
      'payment_confirmation',
      {
        transactionId: transaction._id,
        amount: amount,
        newBalance: wallet.wallet_amount,
        wallet_type: wallet_type,
      },
    );

    const user = await this.userService.findOne(userId);
    if (user.fcm_token) {
      const send_data = {
        _id: user._id.toString(),
        more_action: 'credited',
        wallet_type: wallet_type,
      };
      sendNotification(title, msg, user.fcm_token, send_data);
    }

    return {
      message: msg,
      transaction,
      new_balance: wallet.wallet_amount,
      wallet_type: wallet_type,
    };
  }

  async withdrawWalletBalance(
    userId: string,
    amount: number,
    phone_number: string,
    type: TransactionType.WITHDRAWAL,
    minWithdrawalAmount = 500,
    wallet_type: string = 'user',
    status: WithdrawStatus = WithdrawStatus.PENDING,
  ): Promise<{ newBalance: number; transaction: any }> {
    const wallet = await this.getWalletBalance(userId, wallet_type);

    // Vérifications initiales du solde
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

    // Création de la transaction avec le statut
    const transaction = await this.walletTransactionModel.create({
      user: new Types.ObjectId(userId),
      amount,
      type,
      phone_number,
      wallet_type: wallet_type,
      status,
    });

    let notificationTitle = '';
    let notificationMessage = '';
    let shouldWithdraw = false;

    // Gestion des différents statuts
    switch (status) {
      case WithdrawStatus.ACCEPTED:
        notificationTitle = 'Demande de retrait reçue';
        notificationMessage = `Votre demande de retrait de ${amount} XOF a été bien reçue et est en cours de traitement.`;
        break;

      case WithdrawStatus.PENDING:
        notificationTitle = 'Demande de retrait en cours';
        notificationMessage = `Votre demande de retrait de ${amount} XOF est en cours de traitement.`;
        break;

      case WithdrawStatus.REJECTED:
        notificationTitle = 'Demande de retrait rejetée';
        notificationMessage = `Votre demande de retrait de ${amount} XOF a été rejetée.`;
        break;

      case WithdrawStatus.VALIDATED:
        notificationTitle = 'Demande de retrait approuvé';
        notificationMessage = `Votre retrait de ${amount} XOF a été effectué avec succès. Nouveau solde: ${wallet.wallet_amount - amount} XOF`;
        shouldWithdraw = true;
        break;
    }

    // Si le statut est VALIDATED, on effectue le retrait
    if (shouldWithdraw) {
      wallet.wallet_amount -= amount;
      wallet.updated_at = new Date();
      await wallet.save();
    }

    // Envoi de la notification
    await this.notificationService.createNotification(
      userId,
      notificationTitle,
      notificationMessage,
      'payment_confirmation',
      {
        transactionId: transaction._id,
        amount: amount,
        newBalance: wallet.wallet_amount,
        wallet_type: wallet_type,
        status: status,
      },
    );

    const user = await this.userService.findOne(userId);
    if (user.fcm_token) {
      const send_data = {
        _id: user._id.toString(),
        more_action: 'withdraw',
        wallet_type: wallet_type,
        status: status,
      };
      sendNotification(
        notificationTitle,
        notificationMessage,
        user.fcm_token,
        send_data,
      );
    }

    return {
      newBalance: wallet.wallet_amount,
      transaction,
    };
  }

  async getWalletTransactions(userId: string, wallet_type: string = 'user') {
    const transactions = await this.walletTransactionModel
      .find({
        user: new Types.ObjectId(userId),
        wallet_type: wallet_type,
      })
      .sort({ created_at: -1 })
      .select('amount phone_number status type created_at')
      .exec();

    return transactions;
  }

  findAll() {
    return `This action returns all wallet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(creditWalletDto: CreditWalletDto) {
    return this.creditWalletUserCustomBalance(
      creditWalletDto.user.toString(),
      creditWalletDto.amount,
      'Recharge',
      'Votre portefeuille a été rechargé avec succès.',
      TransactionType.WITHDRAWAL,
      'user',
    );
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
