import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePrivacyPolicyDto } from './dto/create-privacy_policy.dto';
import { UpdatePrivacyPolicyDto } from './dto/update-privacy_policy.dto';
import { PrivacyPolicy, PrivacyPolicyDocument } from '../Schemas/privacy_policy_schema/privacy_policy.schema';

@Injectable()
export class PrivacyPolicyService {
  constructor(
    @InjectModel(PrivacyPolicy.name) private privacyPolicyModel: Model<PrivacyPolicyDocument>,
  ) {}

  private generateUniqueKey(baseKey: string = 'privacy-policy'): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${baseKey}-${timestamp}-${randomString}`;
  }

  async create(createPrivacyPolicyDto: CreatePrivacyPolicyDto) {
    const uniqueKey = this.generateUniqueKey(createPrivacyPolicyDto.key);
    const createdPolicy = new this.privacyPolicyModel({
      ...createPrivacyPolicyDto,
      key: uniqueKey,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return createdPolicy.save();
  }

  async findAll() {
    return this.privacyPolicyModel.find().exec();
  }

  async findOne(id: string) {
    return this.privacyPolicyModel.findById(id).exec();
  }

  async findByKey(key: string) {
    return this.privacyPolicyModel.findOne({ key }).exec();
  }

  async update(id: string, updatePrivacyPolicyDto: UpdatePrivacyPolicyDto) {
    return this.privacyPolicyModel.findByIdAndUpdate(
      id,
      { ...updatePrivacyPolicyDto, updated_at: new Date() },
      { new: true }
    ).exec();
  }

  async remove(id: string) {
    return this.privacyPolicyModel.findByIdAndDelete(id).exec();
  }
}