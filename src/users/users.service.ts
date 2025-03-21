import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UserType } from '../Schemas/users_schema/Users.schema';
import { HydratedDocument, Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { WalletService } from "../wallet/wallet.service";
import { ReferenceHistoryService } from 'src/reference_history/reference_history.service';
import { Config } from 'src/Schemas/config_schema/config.schema';
import { Zems } from 'src/Schemas/zems_schema/Zems.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
    @InjectModel(Config.name) private readonly configModel: Model<Config>,
    @InjectModel(Zems.name) private readonly zemsModel: Model<Zems>,
    @Inject(forwardRef(() => WalletService))
    private readonly walletService: WalletService,
    @Inject(forwardRef(() => ReferenceHistoryService))
    private readonly referenceHistoryService: ReferenceHistoryService,
  ) { }

  /* Méthode pour générer un code unique de parrainage */
  async generateUniqueCode(prefix: string = 'ZP'): Promise<string> {
    let sponsorship_code: string;
    let isUnique = false;

    while (!isUnique) {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      sponsorship_code = `${prefix}-${randomNum}`;
      const existingUser = await this.userModel
        .findOne({ sponsorship_code: sponsorship_code });
      if (!existingUser) {
        isUnique = true;
      }
    }

    return sponsorship_code;
  }

  async handleReferralCode(newUserId: string, referalCode: string) {
    try {
      // Recherche le parrain par son sponsorship_code
      const referrer = await this.userModel.findOne({ sponsorship_code: referalCode });
      if (!referrer) {
        throw new HttpException('Code de parrainage invalide', HttpStatus.BAD_REQUEST);
      }

      // Crée l'historique de parrainage et attribue le bonus
      await this.referenceHistoryService.createReferenceHistory(
        referrer._id.toString(),
        newUserId
      );

    } catch (error) {
      console.error('Erreur lors du traitement du code de parrainage:', error);
      throw error;
    }
  }



  async findByPhone(phone_number: string, checkValidated: boolean = false): Promise<Users> {
    const query: any = {
      phone_number,
      deleted_at: null // On cherche uniquement les comptes non supprimés
    };

    if (checkValidated) {
      query.validated_at = { $ne: null };
    }

    const user = await this.userModel
      .findOne(query)
      .sort({ created_at: -1 }) // Pour obtenir le plus récent en premier
      .populate('race')
      .exec();

    return user;
  }

  async findByVerificationCode(
    verification_code: string,
  ): Promise<Users | null> {
    return this.userModel.findOne({ verification_code }).exec();
  }

  /* Correction de la méthode findOne pour retourner un utilisateur */
  async findOne(id: string): Promise<Users | null> {
    return this.userModel
      .findById(id)
      .populate('zem')
      .populate({
        path: 'race',
        match: {
          status: {
            $in: ['pending', 'accepted', 'start'],
          },
        },
        populate: {
          path: 'user',
          select: ['_id', 'phone_number', 'firstname', 'lastname', 'user_profile_image'],
        },
      })
      .lean()
      .exec();
  }

  async createTemporary(userData: Partial<Users>): Promise<Users> {
    try {
      // Vérifier si un compte actif existe avec ce numéro
      const activeUser = await this.userModel.findOne({
        phone_number: userData.phone_number,
        validated_at: { $ne: null },
        deleted_at: null
      });

      if (activeUser) {
        throw new HttpException(
          'Ce numéro de téléphone est déjà attribué à un compte actif',
          HttpStatus.BAD_REQUEST
        );
      }

      // Générer un code de parrainage unique
      const sponsorship_code = await this.generateUniqueCode();
      userData.sponsorship_code = sponsorship_code;

      // Hasher le mot de passe si présent
      if (userData.password) {
        const salt = await bcrypt.genSalt();
        userData.password = await bcrypt.hash(userData.password, salt);
      }

      // Créer un nouvel utilisateur
      const user = new this.userModel(userData);
      const savedUser = await user.save();

      // Initialiser le wallet
      await this.walletService.getWalletBalance(savedUser._id.toString());

      // Gérer le code de parrainage si fourni
      if (userData.referal_code) {
        await this.handleReferralCode(savedUser._id.toString(), userData.referal_code);
      }

      return savedUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new Error(`Erreur lors de la création de l'utilisateur: ${error.message}`);
    }
  }

  async verifyUserStatus(phone_number: string): Promise<void> {
    const user = await this.findByPhone(phone_number);
    if (user && user.deleted_at) {
      throw new HttpException(
        'Ce compte n\'existe plus sur notre serveur',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateData: Partial<Users>): Promise<Users | null> {
    try {
      console.log('Données transmises à updateData :', updateData);

      // Si un mot de passe est fourni, on le hash
      if (updateData.password) {
        const salt = await bcrypt.genSalt();
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }

      // Mise à jour de l'utilisateur dans la base de données
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();

      // Si l'utilisateur n'est pas trouvé, on retourne null
      if (!updatedUser) {
        console.error(`Erreur : utilisateur avec l'ID ${id} introuvable`);
        return null;
      }

      console.log('Utilisateur mis à jour :', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      throw new Error(
        "Une erreur est survenue lors de la mise à jour de l'utilisateur",
      );
    }
  }


  async findBySponsorshipCode(sponsorshipCode: string): Promise<Users | null> {
    return this.userModel.findOne({ sponsorship_code: sponsorshipCode }).exec();
  }

  async findByMail(email_address: string): Promise<Users> {
    const user = await this.userModel
      .findOne({ email_address })
      .populate('race')
      .exec();
    return user;
  }

  async findAllAdmins() {
    return this.userModel.find({ user_type: 'admin' }).exec();
  }


  /* Correction de la méthode findOne pour retourner un utilisateur */
  /*  async findOne(id: string): Promise<Users | null> {
      return this.userModel
        .findById(id)
        .populate('zem')
        .populate({
          path: 'race',
          match: {
            status: {
              $in: ['pending', 'accepted', 'start'],
            },
          },
        })
        .lean()
        .exec();
    }*/

  async findUserOne(
    id: string,
  ): Promise<Array<HydratedDocument<Users, {}, {}>>> {
    console.log('findUserOne', id);
    return await this.userModel.find({ phone_number: id }).exec();
  }
  async findUserOneByKey(
    key_co: string,
    value: string,
  ): Promise<Array<HydratedDocument<Users, {}, {}>>> {
    return await this.userModel.find({ key: value }).exec();
  }

  async findUserOneByPayload(payload: {}): Promise<
    Array<HydratedDocument<Users, {}, {}>>
  > {
    return await this.userModel.find(payload).exec();
  }

  findAll() {
    return this.userModel.find().populate('role').exec();
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async deleteAccount(userId: string): Promise<Users> {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        deleted_at: new Date(),
        validated_at: null, // Réinitialiser validated_at
        verification_code: null, // Optionnel: réinitialiser aussi le code de vérification
      },
      { new: true }
    ).exec();
  }
}
