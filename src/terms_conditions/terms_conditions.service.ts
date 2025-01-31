import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTermsConditionDto } from './dto/create-terms_condition.dto';
import { UpdateTermsConditionDto } from './dto/update-terms_condition.dto';
import { TermsConditions, TermsConditionsDocument } from '../Schemas/terms_conditions_schema/terms_conditions.schema';

@Injectable()
export class TermsConditionsService {
  constructor(
    @InjectModel(TermsConditions.name) private termsConditionsModel: Model<TermsConditionsDocument>,
  ) {}

  async create(createTermsConditionDto: CreateTermsConditionDto) {
    const createdTerms = new this.termsConditionsModel({
      ...createTermsConditionDto,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return createdTerms.save();
  }

  async findAll() {
    return this.termsConditionsModel.find().exec();
  }

  async findOne(id: string) {
    return this.termsConditionsModel.findById(id).exec();
  }

  async findByKey(key: string) {
    return this.termsConditionsModel.findOne({ key }).exec();
  }

  async update(id: string, updateTermsConditionDto: UpdateTermsConditionDto) {
    return this.termsConditionsModel.findByIdAndUpdate(
      id,
      { ...updateTermsConditionDto, updated_at: new Date() },
      { new: true }
    ).exec();
  }

  async remove(id: string) {
    return this.termsConditionsModel.findByIdAndDelete(id).exec();
  }
}