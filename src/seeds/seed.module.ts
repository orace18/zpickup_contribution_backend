import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigSeeder } from './config/config.seeder';
import { Config, ConfigSchema } from '../Schemas/config_schema/config.schema';
import { FAQ, FAQSchema } from 'src/Schemas/FAQ_schema/FAQ.schema';
import { FaqSeeder } from './faq/faq.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }, { name: FAQ.name, schema: FAQSchema }]),
  ],
  providers: [ConfigSeeder, FaqSeeder],
  exports: [ConfigSeeder, FaqSeeder],
})
export class SeedsModule {}
