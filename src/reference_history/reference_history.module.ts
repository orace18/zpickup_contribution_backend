import { forwardRef, Module } from '@nestjs/common';
import { ReferenceHistoryService } from './reference_history.service';
import { ReferenceHistoryController } from './reference_history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReferenceHistory, ReferenceHistorySchema } from 'src/Schemas/reference_history_schema/reference_history_schema.schema';
import { Config, ConfigSchema } from 'src/Schemas/config_schema/config.schema';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReferenceHistory.name, schema: ReferenceHistorySchema },
      { name: Config.name, schema: ConfigSchema }
    ]),
    forwardRef(() => WalletModule),
  ],

  controllers: [ReferenceHistoryController],
  providers: [ReferenceHistoryService],
  exports: [ReferenceHistoryService],
})
export class ReferenceHistoryModule {}
