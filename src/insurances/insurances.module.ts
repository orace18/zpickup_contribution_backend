import { Module } from '@nestjs/common';
import { InsurancesService } from './insurances.service';
import { InsurancesController } from './insurances.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Insurances, InsuranceSchema } from '../Schemas/insurances_schema/insurances.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Insurances.name, schema: InsuranceSchema }])
  ],
  controllers: [InsurancesController],
  providers: [InsurancesService],
})
export class InsurancesModule {}
