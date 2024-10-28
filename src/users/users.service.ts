import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from '../Schemas/users_schema/Users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}

  // Méthode pour générer un code unique de parrainage
  async generateUniqueSponsorshipCode(): Promise<string> {
    let sponsorship_code;
    let isUnique = false;

    while (!isUnique) {
      sponsorship_code = `ZP-${Math.floor(100000 + Math.random() * 900000).toString()}`;
      const existingUser = await this.userModel.findOne({ sponsorship_code }).exec();
      if (!existingUser) {
        isUnique = true;
      }
    }

    return sponsorship_code;
  }

  async findByPhone(phone_number: string): Promise<Users | null> {
    return this.userModel.findOne({ phone_number }).exec();
  }

  async findByVerificationCode(verification_code: string): Promise<Users | null> {
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

  async update(id: string, updateData: Partial<CreateUserDto>): Promise<Users | null> {

    if (updateData.password) {
      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  // Correction de la méthode findOne pour retourner un utilisateur
  async findOne(id: string): Promise<Users | null> {
    return this.userModel.findById(id).exec();
  }

  findAll() {
    return this.userModel.find();
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
