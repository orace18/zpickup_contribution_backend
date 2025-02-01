import { Module } from '@nestjs/common';
import { SponsorshipService } from './sponsorship.service';
import { SponsorshipController } from './sponsorship.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sponsorship, SponsorshipSchema } from '../Schemas/sponsorship_schema/sponsorship.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sponsorship.name, schema: SponsorshipSchema }])
  ],
  controllers: [SponsorshipController],
  providers: [SponsorshipService],
})
export class SponsorshipModule {}
