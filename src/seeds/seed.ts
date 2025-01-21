import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ConfigSeeder } from './config/config.seeder';
import { FaqSeeder } from './faq/faq.seeder';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    
    // Exécuter ConfigSeeder
    const configSeeder = app.get(ConfigSeeder);
    await configSeeder.seed();
    console.log('config seeding completed');
    
    // Exécuter FaqSeeder
    const faqSeeder = app.get(FaqSeeder);
    await faqSeeder.faqSeed();
    console.log('FAQ seeding completed');

    await app.close();
}

bootstrap();
