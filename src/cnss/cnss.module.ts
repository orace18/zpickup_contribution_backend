import { Module } from '@nestjs/common';
import { CnssService } from './cnss.service';
import { CnssController } from './cnss.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cnss, CnssSchema } from '../Schemas/cnss_schema/cnss.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cnss.name, schema: CnssSchema }])
  ],
  controllers: [CnssController],
  providers: [CnssService],
})
export class CnssModule {}
