import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ConfigSeeder } from './config/config.seeder';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const configSeeder = app.get(ConfigSeeder);

    await configSeeder.seed();
    console.log('config seeding completed');

    await app.close();
}

bootstrap();
