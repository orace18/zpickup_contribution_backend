import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from '../Schemas/wallet_schema/wallet.schema';
import { Config, ConfigSchema } from '../Schemas/config_schema/config.schema';
import { WalletTransaction, WalletTransactionSchema } from '../Schemas/wallet_schema/wallet_transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: Config.name, schema: ConfigSchema },
      { name: WalletTransaction.name, schema: WalletTransactionSchema },
    ]),
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
