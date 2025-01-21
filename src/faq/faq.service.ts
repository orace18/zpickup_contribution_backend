import { Injectable } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FAQ } from 'src/Schemas/FAQ_schema/FAQ.schema';
import { Model } from 'mongoose';

@Injectable()
export class FaqService {

  constructor(
    @InjectModel(FAQ.name) private faqModel: Model<FAQ>,
  ) { }

  // fonction pour la creation d'un nouveau FAQ
  async createFAQ(createFaqDto: CreateFaqDto): Promise<FAQ> {
    const createdFaq = new this.faqModel({
      ...createFaqDto,
      created_at: new Date(),
      updated_at: new Date()
    });
    return createdFaq.save();
  }

  // fonction pour la recupération de tous les FAQ
  async findAllFAQ(): Promise<FAQ[]> {
    return this.faqModel.find().exec();
  }

  // fonction pour mettre à jour un FAQ
  async updateFAQ(id: string, updateFaqDto: UpdateFaqDto): Promise<FAQ> {
    return this.faqModel.findByIdAndUpdate(id,
      { ...updateFaqDto, updated_at: new Date() },
      { new: true }
    );
  }

  // Récupérer une FAQ spécifique par sa clé
  async findByKey(faq_key: string): Promise<FAQ> {
    return this.faqModel.findOne({ "key": faq_key }).exec();
  }

  // fonction pour la suppression d'un FAQ
  async removeFAQ(id: string): Promise<FAQ> {
    return this.faqModel.findByIdAndDelete(id).exec();
  }
}
