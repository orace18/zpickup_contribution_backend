import { Module } from '@nestjs/common';
import { GSMNumberFormatService } from './gsmnumber-format.service';
import { GSMNumberFormatController } from './gsmnumber-format.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GSMNumberFormat, GSMNumberFormatSchema } from 'src/Schemas/gsm_number_format_schema/gsm_number_format.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GSMNumberFormat.name, schema: GSMNumberFormatSchema }
    ])
  ],
  controllers: [GSMNumberFormatController],
  providers: [GSMNumberFormatService],
  exports: [GSMNumberFormatService]
})
export class GSMNumberFormatModule {}
