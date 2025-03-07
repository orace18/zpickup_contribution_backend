import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateZemDto } from './dto/create-zem.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProfileValidationStatus, Zems } from '../Schemas/zems_schema/Zems.schema';
import { Model } from 'mongoose';
import {calculateDistance, sendNotificationForSeveralTokens} from "../services/helpers.service";
import {Config} from "../Schemas/config_schema/config.schema";
import {CoursesStatus, Races} from "../Schemas/races_schema/races.schema";
import { Counter } from 'src/Schemas/counter_schema/counter.schema';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ZemsService {
  constructor(@InjectModel(Zems.name) private readonly zemModel: Model<Zems>,
              @InjectModel(Config.name) private configModel: Model<Config>,
              @InjectModel(Races.name) private racesModel: Model<Races>,
              @InjectModel(Counter.name) private counterModel: Model<Counter>,
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
      validated_at: createZemDto.is_temporal ? fortyFiveDaysLater : null,
    };
    
    const created = new this.zemModel(zemData);
    
    // Retourner une seule promesse de sauvegarde au lieu de deux
    return created.save().then(savedDoc => {
      console.log('Account created with validated_at:', fortyFiveDaysLater);
      return savedDoc; // Retourner le document sauvegardé
    });
  }

  async checkTemporalValidation(zemId: string) {
    const zem = await this.zemModel.findById(zemId).exec();
    if (!zem) {
      throw new NotFoundException('Zem not found');
    }

    if (zem.is_temporal && zem.temporal_validated_at) {
      const now = new Date();
      if (now > zem.temporal_validated_at) {
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



  findAll() {
    return this.zemModel.find();
  }

  async findOne(id: string) {
    const zem = await this.zemModel.findById(id).exec();
    if (zem && zem.is_temporal) {
      const remainingDays = await this.getRemainingDays(id);
      return {
        ...zem.toObject(),
        remaining_days: remainingDays,
      };
    }
    return zem;
  }

  async getRemainingDays(zemId: string): Promise<number | null> {
    const zem = await this.zemModel.findById(zemId).exec();
    if (!zem || !zem.is_temporal || !zem.validated_at) {
      console.log('No temporal validation or validated_at is missing');
      return null;
    }
  
    const now = new Date();
    const expirationDate = new Date(zem.validated_at);
    console.log('Current date:', now);
    console.log('Expiration date:', expirationDate);
  
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    return diffDays > 0 ? diffDays : 0;
  }

  update(id: string, updateData: Partial<Zems>) {
    return this.zemModel.findByIdAndUpdate(id, updateData).exec();
  }

  remove(id: string) {
    return `This action removes a #${id} zem`;
  }

  async sendNotificationForAllUserInRay(zem_id){
    const zem = await this.findOne(zem_id);
    const ray = await this.configModel.findOne({ key: 'ray' }).exec();
    const races: Races[] = await this.racesModel
        .find({
          status: CoursesStatus.PENDING,
        })
        .populate('user', [
          '_id',
          'fcm_token',
            'user_type'
        ])
        .lean()
        .exec();
    if(zem.service_latitude!=null &&  zem.service_longitude !=null){
      const filteredZems = races.filter(service => {
        const distance = calculateDistance(
            service.initial_latitude,
            service.initial_longitude,
            zem.service_latitude,
            zem.service_longitude
        );
        return (zem.ray==null ? (distance <= parseFloat(ray.value)) : (distance <= zem.ray));
      });
      const tokens = [];
      let body_notification_zem =
          'Nouveau conducteur disponible pour vous';
      let more_action_zem = 'available_zem';
      for (let i = 0; i < filteredZems.length; i++) {
        const user = filteredZems[i]['user'];
        console.log("user",user);
        if (user) {
          if (user['fcm_token'] && user['user_type']=="customer") {
            if (!tokens.includes(user['fcm_token'])) {
              tokens.push(user['fcm_token']);
            }
          }
        }
      }
      console.log("tokens",tokens);

      if(tokens.length>0){
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
      { new: true }
    );

    return updatedZem;
  }

  async makeAmbassador(zemId: string): Promise<Zems> {
    const updatedZem = await this.zemModel.findByIdAndUpdate
    (
      zemId,
      { $set: { is_ambassador: true } },
      { new: true }
    ); 
    return updatedZem;  
  }

  @Cron('0 0 1 * *') // Exécute à minuit (00:00) le 1er jour de chaque mois
  async automaticMonthlyKmForAmbassadors() {
    console.log('Exécution automatique de l\'ajout des km pour les ambassadeurs');
    await this.addMonthlyKmToAmbassadors();
    console.log('Ajout des km terminé avec succès');
  }

  async addMonthlyKmToAmbassadors(zemId?: string) {
    // Vérification de la date du jour
    const today = new Date();
    const isFirstDayOfMonth = today.getDate() === 1;
    
    // Si ce n'est pas le 1er du mois, on arrête
    if (!isFirstDayOfMonth) {
      console.log(`Aujourd'hui (${today.toISOString().split('T')[0]}) n'est pas le 1er du mois, aucune action n'est effectuée`);
      return {
        success: false,
        message: `L'ajout de kilomètres aux ambassadeurs n'est autorisé que le 1er du mois (date actuelle: ${today.toISOString().split('T')[0]})`
      };
    }

    // Récupération de la configuration pour le nombre de km à ajouter
    const balance_abs_km = await this.configModel.findOne({ key: 'monthly-km-for-ambassador' }).exec();
    let kmToAdd = 100; // Valeur par défaut si la configuration n'existe pas
    
    if (balance_abs_km && balance_abs_km.value) {
      kmToAdd = parseFloat(balance_abs_km.value);
    } else {
      console.log('Configuration "monthly-km-for-ambassador" non trouvée, utilisation de la valeur par défaut de 100 km');
    }

    // Construction de la requête pour trouver les ambassadeurs
    const query = zemId ? { _id: zemId, is_ambassador: true } : { is_ambassador: true };
    const ambassadors = await this.zemModel.find(query).exec();
    
    if (ambassadors.length === 0) {
      return {
        success: false,
        message: zemId 
          ? `Aucun ambassadeur trouvé avec l'ID ${zemId}`
          : 'Aucun ambassadeur trouvé dans le système'
      };
    }
    
    console.log(`${ambassadors.length} ambassadeurs trouvés pour l'ajout de ${kmToAdd} km`);
    let updatedCounters = 0;

    // Ajout des km à chaque ambassadeur
    for (const ambassador of ambassadors) {
      const counter = await this.counterModel.findOne({ zem: ambassador._id }).exec();
      if (counter) {
        counter.balance_km += kmToAdd;
        counter.balance_abs_km += kmToAdd;
        await counter.save();
        updatedCounters++;
        console.log(`${kmToAdd} km ajoutés à l'ambassadeur ${ambassador._id}`);
      } else {
        console.log(`Aucun compteur trouvé pour l'ambassadeur ${ambassador._id}`);
      }
    }

    return {
      success: true,
      ambassadorsCount: ambassadors.length,
      updatedCounters: updatedCounters,
      kmAdded: kmToAdd,
      message: `${kmToAdd} km ajoutés à ${updatedCounters}/${ambassadors.length} ambassadeurs`
    };
  }
}
