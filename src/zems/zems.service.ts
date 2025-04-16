import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateZemDto } from './dto/create-zem.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProfileValidationStatus,
  Zems,
} from '../Schemas/zems_schema/Zems.schema';
import mongoose, { Model, Types } from 'mongoose';
import {
  calculateDistance,
  sendNotificationForSeveralTokens,
} from '../services/helpers.service';
import { Config } from '../Schemas/config_schema/config.schema';
import { CoursesStatus, Races } from '../Schemas/races_schema/races.schema';
import { Counter } from 'src/Schemas/counter_schema/counter.schema';
import { Cron } from '@nestjs/schedule';
import { ReferenceHistoryService } from 'src/reference_history/reference_history.service';
import { WalletService } from 'src/wallet/wallet.service';
import { TransactionType } from 'src/Schemas/wallet_schema/wallet_transaction.schema';
import { ReferenceHistory } from 'src/Schemas/reference_history_schema/reference_history_schema.schema';
import { AbsKmHistory } from 'src/Schemas/abs_km_history/abs_km_history.schema';

@Injectable()
export class ZemsService {
  constructor(
    @InjectModel(Zems.name) private readonly zemModel: Model<Zems>,
    @InjectModel(Config.name) private configModel: Model<Config>,
    @InjectModel(Races.name) private racesModel: Model<Races>,
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
    @InjectModel(ReferenceHistory.name)
    private referenceHistoryModel: Model<ReferenceHistory>,
    @InjectModel(AbsKmHistory.name)
    private absKmHistoryModel: Model<AbsKmHistory>,
    private readonly referenceHistoryService: ReferenceHistoryService,
    private readonly walletService: WalletService,
  ) {}

  async create(createZemDto: CreateZemDto) {
    const now = new Date();
    const fortyFiveDaysLater = new Date(now);
    fortyFiveDaysLater.setDate(now.getDate() + 45);

    const zemData = {
      ...createZemDto,
      profile_validation_status: createZemDto.is_temporal
        ? ProfileValidationStatus.VALIDATED
        : ProfileValidationStatus.IN_PROGRESS,
      temporal_validated_at: createZemDto.is_temporal ? now : null,
      validated_at: createZemDto.is_temporal ? now : null,
      expired_at: createZemDto.is_temporal ? fortyFiveDaysLater : null,
    };

    const created = new this.zemModel(zemData);

    const savedZem = await created.save();

    // Si le Zem est créé avec le statut validé directement
    if (
      savedZem.profile_validation_status === ProfileValidationStatus.VALIDATED
    ) {
      await this.handleZemValidationBonus(savedZem.user.toString());
    }

    return savedZem;
  }

  async checkTemporalValidation(zemId: string) {
    const zem = await this.zemModel.findById(zemId).exec();
    if (!zem) {
      throw new NotFoundException('Zem not found');
    }

    // Vérifier si le zem est temporaire et a une date d'expiration
    if (zem.is_temporal && zem.expired_at) {
      const now = new Date();
      if (now > zem.expired_at) {
        // Le compte est expiré, le bloquer
        await this.zemModel.findByIdAndUpdate(zemId, {
          profile_validation_status: ProfileValidationStatus.REJECTED,
          temporal_validated_at: null,
          validated_at: null,
        });
        throw new Error('Temporary validation has expired');
      }
    }
  }

  async getRemainingDays(zemId: string): Promise<number | null> {
    const zem = await this.zemModel.findById(zemId).exec();
    if (!zem || !zem.is_temporal || !zem.expired_at) {
      console.log('No temporal validation or expired_at is missing');
      return null;
    }

    const now = new Date();
    const expirationDate = new Date(zem.expired_at);
    console.log('Current date:', now);
    console.log('Expiration date:', expirationDate);

    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }

  async unAmbassador(zemId: string): Promise<Partial<Zems>> {
    const updatedZem = await this.zemModel.findOne({ _id: zemId }).exec();

    if (!updatedZem) {
      throw new NotFoundException('Zem non trouvé');
    }

    updatedZem.is_ambassador = false;
    await updatedZem.save();

    return updatedZem;
  }

  findAll() {
    return this.zemModel.find();
  }

  async findByUserId(userId: string): Promise<Zems | null> {
    return this.zemModel.findOne({ user: userId }).exec();
  }

  async findOne(id: string) {
    // Vérifier si id est défini et valide
    if (!id) {
      throw new BadRequestException('ID is required');
    }

    // Vérifier si l'id est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }

    const zem = await this.zemModel.findById(id).populate('user').exec();

    // Vérifier si le zem existe
    if (!zem) {
      throw new NotFoundException(`Zem with ID ${id} not found`);
    }

    if (zem.is_temporal) {
      const remainingDays = await this.getRemainingDays(id);
      return {
        ...zem.toObject(),
        remaining_days: remainingDays,
      };
    }

    return zem;
  }

  async convertTemporalToValidated(zemId: string) {
    const zem = await this.zemModel.findById(zemId).exec();
    if (!zem) {
      throw new NotFoundException('Zem not found');
    }

    if (!zem.is_temporal) {
      throw new Error('Not a temporal Zem');
    }

    const now = new Date();

    await this.zemModel.findByIdAndUpdate(zemId, {
      is_temporal: false,
      expired_at: null,
      temporal_validated_at: null,
      validated_at: now,
      profile_validation_status: ProfileValidationStatus.VALIDATED,
    });

    return {
      success: true,
      message: 'Zem successfully converted to permanent validated status',
    };
  }

  // Pour automatiquement vérifier et gérer les Zems temporaires expirés
  @Cron('0 0 * * *') // Exécution quotidienne à minuit
  async handleExpiredTemporalZems() {
    console.log('Checking for expired temporal Zems...');
    const now = new Date();

    // Trouver tous les Zems temporaires qui sont expirés
    const expiredZems = await this.zemModel
      .find({
        is_temporal: true,
        expired_at: { $lt: now },
        profile_validation_status: ProfileValidationStatus.VALIDATED,
      })
      .exec();

    console.log(`Found ${expiredZems.length} expired temporal Zems`);

    // Mettre à jour leur statut
    for (const zem of expiredZems) {
      await this.zemModel.findByIdAndUpdate(zem._id, {
        profile_validation_status: ProfileValidationStatus.REJECTED,
        temporal_validated_at: null,
        validated_at: null,
      });

      console.log(`Zem ${zem._id} expired status updated`);
    }

    return {
      success: true,
      expiredZemsCount: expiredZems.length,
    };
  }

  async update(id: string, updateData: Partial<Zems>) {
    const updatedZem = await this.zemModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('user')
      .exec();

    return updatedZem;
  }

  private async handleZemValidationBonus(userId: string) {
    try {
      // 1. Chercher l'historique de parrainage pour cet utilisateur
      const referralHistory = await this.referenceHistoryModel
        .findOne({
          referred: new Types.ObjectId(userId),
          is_ambassador_referral: true,
        })
        .exec();

      if (!referralHistory) {
        console.log("Pas d'historique de parrainage ambassadeur trouvé");
        return;
      }

      // 2. Vérifier si le parrain est toujours un ambassadeur
      const referrerZem = await this.zemModel
        .findOne({
          user: referralHistory.referrer,
          is_ambassador: true,
        })
        .exec();

      if (!referrerZem) {
        console.log("Le parrain n'est pas/plus un ambassadeur");
        return;
      }

      // 3. Récupérer le montant du bonus
      const zemBonusConfig = await this.configModel
        .findOne({ key: 'ambassador-zem-affiliation-bonus' })
        .exec();

      if (!zemBonusConfig) {
        console.error('Configuration du bonus Zem non trouvée');
        return;
      }

      // 4. Créditer le portefeuille ambassadeur
      await this.walletService.creditWalletUserCustomBalance(
        referralHistory.referrer.toString(),
        parseFloat(zemBonusConfig.value),
        'Bonus Validation Zem',
        `Bonus pour la validation du compte Zem de votre filleul - ${zemBonusConfig.value} XOF`,
        TransactionType.BONUS,
        'ambassador',
      );

      console.log(
        `Bonus de ${zemBonusConfig.value} XOF crédité au portefeuille ambassadeur de ${referralHistory.referrer}`,
      );
    } catch (error) {
      console.error(
        'Erreur lors du traitement du bonus de validation Zem:',
        error,
      );
    }
  }

  remove(id: string) {
    return `This action removes a #${id} zem`;
  }

  async sendNotificationForAllUserInRay(zem_id, old_zem) {
    let zem = await this.findOne(zem_id);
    const ray = await this.configModel.findOne({ key: 'ray' }).exec();
    const races: Races[] = await this.racesModel
      .find({
        status: CoursesStatus.PENDING,
      })
      .populate('user', ['_id', 'fcm_token', 'user_type'])
      .lean()
      .exec();
    if (zem.service_latitude == null && zem.service_longitude == null) {
      zem = old_zem;
    }
    if (zem.service_latitude != null && zem.service_longitude != null) {
      const filteredZems = races.filter((service) => {
        const distance = calculateDistance(
          service.initial_latitude,
          service.initial_longitude,
          zem.service_latitude,
          zem.service_longitude,
        );
        return zem.ray == null
          ? distance <= parseFloat(ray.value)
          : distance <= zem.ray;
      });
      const tokens = [];
      const body_notification_zem = 'Nouveau conducteur disponible pour vous';
      const more_action_zem = 'available_zem';
      for (let i = 0; i < filteredZems.length; i++) {
        const user = filteredZems[i]['user'];
        console.log('user', user);
        if (user) {
          if (user['fcm_token'] && user['user_type'] == 'customer') {
            if (!tokens.includes(user['fcm_token'])) {
              tokens.push(user['fcm_token']);
            }
          }
        }
      }
      console.log('tokens', tokens);

      if (tokens.length > 0) {
        const send_data = {
          more_action: more_action_zem,
        };
        sendNotificationForSeveralTokens(
          'Course',
          body_notification_zem,
          tokens,
          send_data,
        );
      }
    }
  }

  async updateSearchRadius(zemId: string, newRadius: number): Promise<Zems> {
    const updatedZem = await this.zemModel.findByIdAndUpdate(
      zemId,
      { $set: { ray: newRadius } },
      { new: true },
    );

    return updatedZem;
  }

  async makeAmbassador(
    zemId: string,
    contratDocumentPath?: string,
  ): Promise<Zems> {
    // Création de l'objet de mise à jour
    const updateData: any = { is_ambassador: true };

    // Ajouter le chemin du document de contrat s'il est fourni
    if (contratDocumentPath) {
      updateData.contrat_document = contratDocumentPath;
    }

    const updatedZem = await this.zemModel.findByIdAndUpdate(
      zemId,
      { $set: updateData },
      { new: true },
    );

    if (!updatedZem) {
      throw new NotFoundException(`Zem with ID ${zemId} not found`);
    }

    return updatedZem;
  }

  async getAmbassadorKmHistory(zemId: string) {
    const zem = await this.zemModel.findById(zemId);
    if (!zem) {
      throw new NotFoundException('Zem non trouvé');
    }

    const history = await this.absKmHistoryModel
      .find({ zem: zemId })
      .sort({ createdAt: -1 })
      .exec();

    return {
      zemId: zemId,
      is_ambassador: zem.is_ambassador,
      history: history,
    };
  }

  async addManualKmToAmbassador(zemId: string) {
    // Vérifier si le zem existe et est un ambassadeur
    const zem = await this.zemModel.findById(zemId).exec();
    if (!zem) {
      throw new NotFoundException('Zem non trouvé');
    }

    if (!zem.is_ambassador) {
      throw new Error("Ce Zem n'est pas un ambassadeur");
    }

    // Récupérer la valeur configurée pour les km à ajouter
    const balance_abs_km = await this.configModel
      .findOne({ key: 'monthly-km-for-ambassador' })
      .exec();
    let kmToAdd = 100; // Valeur par défaut si la configuration n'existe pas

    if (balance_abs_km && balance_abs_km.value) {
      kmToAdd = parseFloat(balance_abs_km.value);
    }

    // Trouver et mettre à jour le compteur
    console.log('Searching for counter with zemId:', zemId);
    const counter = await this.counterModel
      .findOne({ zem: new Types.ObjectId(zemId) })
      .exec();

    console.log('Found Counter:', counter);

    if (!counter) {
      throw new Error('Compteur non trouvé pour cet ambassadeur');
    }

    // Ajouter les km
    counter.balance_km += kmToAdd;
    counter.balance_abs_km += kmToAdd;
    await counter.save();

    try {
      const historyEntry = new this.absKmHistoryModel({
        zem: new Types.ObjectId(zemId), // Assurez-vous que l'ID est converti en ObjectId
        kmAdded: kmToAdd,
        type: 'manual',
        description: 'Ajout manuel de kilomètres',
      });

      await historyEntry.save();
      console.log('Historique créé:', historyEntry); // Pour le débogage
    } catch (error) {
      console.error("Erreur lors de la création de l'historique:", error);
      throw error;
    }

    const verifyHistory = await this.absKmHistoryModel
      .find({ zem: zemId })
      .sort({ createdAt: -1 })
      .exec();

    return {
      success: true,
      zemId: zemId,
      kmAdded: kmToAdd,
      currentBalance: counter.balance_km,
      message: `${kmToAdd} km ajoutés avec succès à l'ambassadeur`,
      historyEntry: verifyHistory[0],
    };
  }

  async addManualKmToAllAmbassadors() {
    // Récupérer la valeur configurée pour les km à ajouter
    const balance_abs_km = await this.configModel
      .findOne({ key: 'monthly-km-for-ambassador' })
      .exec();
    let kmToAdd = 100; // Valeur par défaut si la configuration n'existe pas

    if (balance_abs_km && balance_abs_km.value) {
      kmToAdd = parseFloat(balance_abs_km.value);
    }

    // Trouver tous les Zems qui sont des ambassadeurs
    const ambassadors = await this.zemModel
      .find({ is_ambassador: true })
      .exec();
    console.log(`Found ${ambassadors.length} ambassadors`);

    const results = {
      success: true,
      totalAmbassadors: ambassadors.length,
      processedAmbassadors: 0,
      failedAmbassadors: 0,
      kmAdded: kmToAdd,
      message: `${kmToAdd} km ajoutés avec succès à tout les ambassadeurs`,
      details: [],
    };

    // Pour chaque ambassadeur, ajouter les kilomètres
    for (const ambassador of ambassadors) {
      try {
        // Trouver le compteur pour cet ambassadeur
        const counter = await this.counterModel
          .findOne({ zem: ambassador._id })
          .exec();

        if (!counter) {
          console.log(`Counter not found for ambassador ${ambassador._id}`);
          results.details.push({
            zemId: ambassador._id,
            success: false,
            message: 'Compteur non trouvé pour cet ambassadeur',
          });
          results.failedAmbassadors++;
          continue;
        }

        // Ajouter les km
        counter.balance_km += kmToAdd;
        counter.balance_abs_km += kmToAdd;
        await counter.save();

        await this.absKmHistoryModel.create({
          zem: ambassador._id,
          kmAdded: kmToAdd,
          type: 'manual',
          description: 'Ajout manuel de kilomètres',
        });

        results.details.push({
          zemId: ambassador._id,
          success: true,
          currentBalance: counter.balance_km,
        });
        results.processedAmbassadors++;

        console.log(`Added ${kmToAdd} km to ambassador ${ambassador._id}`);
      } catch (error) {
        console.error(`Error processing ambassador ${ambassador._id}:`, error);
        results.details.push({
          zemId: ambassador._id,
          success: false,
          message: error.message,
        });
        results.failedAmbassadors++;
      }
    }

    return results;
  }
}
