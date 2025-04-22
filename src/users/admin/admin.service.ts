import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { Users, UserType } from '../../Schemas/users_schema/Users.schema';
import { Role } from '../../Schemas/roles_schema/Role.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async createAdmin(userData: Partial<Users>): Promise<Users> {
    try {
      // Si aucun rôle n'est spécifié, on utilise le rôle admin par défaut
      let userRole;
      if (userData.role) {
        userRole = await this.roleModel.findById(userData.role);
        if (!userRole) {
          throw new HttpException('Rôle spécifié non trouvé', HttpStatus.NOT_FOUND);
        }
      } else {
        userRole = await this.roleModel.findOne({ key: 'admin' });
        if (!userRole) {
          throw new HttpException('Rôle administrateur non trouvé', HttpStatus.NOT_FOUND);
        }
      }

      const user = new this.userModel({
        ...userData,
        user_type: UserType.ADMIN,
        role: userRole._id,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const savedUser = await user.save();
      return savedUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('Un utilisateur avec ces informations existe déjà', HttpStatus.CONFLICT);
      }
      throw error;
    }
  }

  async findAllAdmins(): Promise<Users[]> {
    return this.userModel
      .find({ user_type: UserType.ADMIN })
      .populate('role')
      .exec();
  }

  async findUserById(id: string): Promise<Users | null> {
    return this.userModel
      .findById(id)
      .populate('role')
      .exec();
  }

  async updateUser(id: string, updateData: Partial<Users>): Promise<Users | null> {
    const { user_type, role, ...safeUpdateData } = updateData;

    if (safeUpdateData.password) {
      const salt = await bcrypt.genSalt();
      safeUpdateData.password = await bcrypt.hash(safeUpdateData.password, salt);
    }

    return this.userModel
      .findByIdAndUpdate(
        id,
        {
          ...safeUpdateData,
          updated_at: new Date()
        },
        { new: true }
      )
      .populate('role')
      .exec();
  }

  async findByPhone(phone_number: string): Promise<Users | null> {
    return this.userModel
      .findOne({ phone_number })
      .populate('role')
      .populate('permissions')
      .exec();
  }

  async findByMail(email_address: string): Promise<Users | null> {
    return this.userModel
      .findOne({ email_address })
      .populate('role')
      .exec();
  }

  async deleteUser(id: string): Promise<Users | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async findOneByEmail(email: string): Promise<Users | null> {
    return this.userModel.findOne({ email_address: email }).exec();
  }


  async updatePassword(email: string, hashedPassword: string): Promise<Users> {
    return this.userModel.findOneAndUpdate(
      { email_address: email },
      { password: hashedPassword },
      { new: true }
    ).exec();
  }
}