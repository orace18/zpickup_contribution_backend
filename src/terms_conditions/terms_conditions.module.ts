import { Module } from '@nestjs/common';
import { TermsConditionsService } from './terms_conditions.service';
import { TermsConditionsController } from './terms_conditions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TermsConditions, TermsConditionsSchema } from 'src/Schemas/terms_conditions_schema/terms_conditions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TermsConditions.name, schema: TermsConditionsSchema }])
  ],
  controllers: [TermsConditionsController],
  providers: [TermsConditionsService],
})
export class TermsConditionsModule {}
