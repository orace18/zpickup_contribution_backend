import { Injectable } from '@nestjs/common';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import {HydratedDocument, Model} from "mongoose";
import {Users} from "../Schemas/users_schema/Users.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Config} from "../Schemas/config_schema/config.schema";

@Injectable()
export class ConfigsService {

  constructor(
      @InjectModel(Config.name) private readonly configModel: Model<Config>,
  ) {}

  create(createConfigDto: CreateConfigDto) {
    return 'This action adds a new config';
  }

  findAll() {
    return `This action returns all configs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} config`;
  }

  async findConfigOneByKey(key_value:string){
    console.log( "key", key_value );
    return await this.configModel.findOne({ "key": key_value }).exec();
  }

  update(id: number, updateConfigDto: UpdateConfigDto) {
    return `This action updates a #${id} config`;
  }

  remove(id: number) {
    return `This action removes a #${id} config`;
  }
}
