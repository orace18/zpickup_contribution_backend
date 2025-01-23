import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateZemDto } from './dto/create-zem.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Zems } from '../Schemas/zems_schema/Zems.schema';
import { Model } from 'mongoose';
import {calculateDistance, sendNotificationForSeveralTokens} from "../services/helpers.service";
import {Config} from "../Schemas/config_schema/config.schema";
import {CoursesStatus, Races} from "../Schemas/races_schema/races.schema";

@Injectable()
export class ZemsService {
  constructor(@InjectModel(Zems.name) private readonly zemModel: Model<Zems>,
              @InjectModel(Config.name) private configModel: Model<Config>,
              @InjectModel(Races.name) private racesModel: Model<Races>,
  ) {}

  create(createZemDto: CreateZemDto) {
    const created = new this.zemModel(createZemDto);
    return created.save();
  }

  findAll() {
    return this.zemModel.find();
  }

  findOne(id: string) {
    return this.zemModel.findById(id).exec();
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
}
