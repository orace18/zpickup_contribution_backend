import { Injectable } from '@nestjs/common';
import { CreatePasswordResetDto } from './dto/create-password-reset.dto';
import { UpdatePasswordResetDto } from './dto/update-password-reset.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PasswordReset } from '../Schemas/password_reset_schema/password_reset.schema';
import { Model } from 'mongoose';
import * as crypto from 'crypto';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectModel(PasswordReset.name) private passwordResetModel: Model<PasswordReset>,
  ) {}
  async create(createPasswordResetDto: CreatePasswordResetDto) {
    const token = crypto.randomBytes(32).toString('hex');

    const passwordReset = new this.passwordResetModel({
      email: createPasswordResetDto.email,
      token,
      createdAt: new Date(),
    });

    return await passwordReset.save();
  }


  findAll() {
    return `This action returns all passwordReset`;
  }

  findOne(id: number) {
    return `This action returns a #${id} passwordReset`;
  }

  update(id: number, updatePasswordResetDto: UpdatePasswordResetDto) {
    return `This action updates a #${id} passwordReset`;
  }

  remove(id: number) {
    return `This action removes a #${id} passwordReset`;
  }
}
