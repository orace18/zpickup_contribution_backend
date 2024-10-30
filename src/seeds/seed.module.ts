import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigSeeder } from './config/config.seeder';
import { Config,ConfigSchema } from '../Schemas/config_schema/config.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
    ],
    providers: [ConfigSeeder],
    exports: [ConfigSeeder],
})
export class SeedsModule {}
