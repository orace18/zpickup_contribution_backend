import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ConfigSeeder } from './config/config.seeder';
import { FaqSeeder } from './faq/faq.seeder';
import { GmsSeeder } from './gms/gsm.seeder';
import { TermsConditionsSeeder } from './terms_conditions/terms-conditions.seeder';
import { PrivacyPolicySeeder } from './privacy_policy/privacy-policy.seeder';

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

    // Exécuter FaqSeeder
    const gsmSeeder = app.get(GmsSeeder);
    await gsmSeeder.seed();
    console.log('GSM seeding completed');

    // Exécuter TermsConditionsSeeder
    const termsConditionsSeeder = app.get(TermsConditionsSeeder);
    await termsConditionsSeeder.seed();
    console.log('TermsConditions seeding completed');

    // Exécuter PrivacyPolicySeeder
    const privacyPolicySeeder = app.get(PrivacyPolicySeeder);
    await privacyPolicySeeder.seed();
    console.log('PrivacyPolicy seeding completed');



    await app.close();
}

bootstrap();
