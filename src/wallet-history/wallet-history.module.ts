import { Module } from '@nestjs/common';
import { WalletHistoryService } from './wallet-history.service';
import { WalletHistoryController } from './wallet-history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WalletHistory,
  WalletHistorySchema,
} from '../Schemas/wallet-history_schema/wallet_history.schema';
import {
  WalletTransaction,
  WalletTransactionSchema,
} from '../Schemas/wallet_schema/wallet_transaction.schema';
import { CreditWallet, CreditWalletSchema } from '../Schemas/wallet_schema/credit-wallet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WalletHistory.name, schema: WalletHistorySchema },
      { name: WalletTransaction.name, schema: WalletTransactionSchema },
      { name: CreditWallet.name, schema: CreditWalletSchema },
    ]),
  ],
  controllers: [WalletHistoryController],
  providers: [WalletHistoryService],
})
export class WalletHistoryModule {}
