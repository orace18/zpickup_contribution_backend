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
    private readonly walletService: WalletService,
  ) { }

  async createReferenceHistory(refferer: string, refered: string) {
    const bonusAmount = await this.configModel.findOne({ key: 'referal-code-bonus' }).exec();

    // crediter le wallet du parrain
    await this.walletService.creditWalletUserCustomBalance(
      refferer,
      parseFloat(bonusAmount.value),
      'Bonus de parrainage',
      `Vous avez reçu ${bonusAmount.value} XOF pour avoir parrainé un nouvel utilisateur`,
      TransactionType.BONUS,
    );

    // enregistrer l'historique
    const referencehistory = await this.referenceHistoryModel.create({
      referrer: new Types.ObjectId(refferer),
      refered: new Types.ObjectId(refered),
      bonus_amount: parseFloat(bonusAmount.value),
      created_at: new Date(),
      updated_at: new Date(),
    });
    return referencehistory;
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

  async findByReferrer(referrerId: string) {
    return this.referenceHistoryModel
      .find({ referrer: new Types.ObjectId(referrerId) })
      .populate('referred', 'firstname lastname phone_number');
  }

  create(createReferenceHistoryDto: CreateReferenceHistoryDto) {
    return 'This action adds a new referenceHistory';
  }
}
