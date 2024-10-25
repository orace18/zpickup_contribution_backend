import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from '../Schemas/users_schema/Users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}

  async findByPhone(phone_number: string): Promise<Users | null> {
    return this.userModel.findOne({ phone_number }).exec();
  }

  async createTemporary(userData: Partial<Users>): Promise<Users> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async update(id: string, updateData: Partial<CreateUserDto>): Promise<Users> {
    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
