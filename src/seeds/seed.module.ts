import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigSeeder } from './config/config.seeder';
import { Config, ConfigSchema } from '../Schemas/config_schema/config.schema';
import { FAQ, FAQSchema } from 'src/Schemas/FAQ_schema/FAQ.schema';
import { FaqSeeder } from './faq/faq.seeder';
import { GSMNumberFormat, GSMNumberFormatSchema } from 'src/Schemas/gsm_number_format_schema/gsm_number_format.schema';
import { GmsSeeder } from './gms/gsm.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }, { name: FAQ.name, schema: FAQSchema }, { name: GSMNumberFormat.name, schema: GSMNumberFormatSchema }]),
  ],
  providers: [ConfigSeeder, FaqSeeder, GmsSeeder],
  exports: [ConfigSeeder, FaqSeeder, GmsSeeder],
})
export class SeedsModule { }
