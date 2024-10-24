import { Module } from '@nestjs/common';
import { WalletHistoryService } from './wallet-history.service';
import { WalletHistoryController } from './wallet-history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletHistory, WalletHistorySchema } from '../Schemas/wallet-history_schema/wallet_history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WalletHistory.name, schema: WalletHistorySchema }])
  ],
  controllers: [WalletHistoryController],
  providers: [WalletHistoryService],
})
export class WalletHistoryModule {}
