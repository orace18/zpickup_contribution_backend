import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from '../Schemas/users_schema/Users.schema';
import { HydratedDocument, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}

  /* Méthode pour générer un code unique de parrainage */
  async generateUniqueSponsorshipCode(): Promise<string> {
    let sponsorship_code;
    let isUnique = false;

    while (!isUnique) {
      sponsorship_code = `ZP-${Math.floor(100000 + Math.random() * 900000).toString()}`;
      const existingUser = await this.userModel
        .findOne({ sponsorship_code })
        .exec();
      if (!existingUser) {
        isUnique = true;
      }
    }

    return sponsorship_code;
  }

  async findByPhone(phone_number: string): Promise<Users> {
    const user = await this.userModel
      .findOne({ phone_number })
      .populate('race')
      .exec();
    return user;
  }

  async findByVerificationCode(
    verification_code: string,
  ): Promise<Users | null> {
    return this.userModel.findOne({ verification_code }).exec();
  }

  async createTemporary(userData: Partial<Users>): Promise<Users> {
    if (userData.password) {
      const salt = await bcrypt.genSalt();
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    const user = new this.userModel(userData);
    return user.save();
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
      })
      .lean()
      .exec();
  }

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
    return this.userModel.find();
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
