import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from '../Schemas/wallet_schema/wallet.schema';
import { Config, ConfigSchema } from '../Schemas/config_schema/config.schema';
import {
  WalletTransaction,
  WalletTransactionSchema,
} from '../Schemas/wallet_schema/wallet_transaction.schema';
import {
  CreditWallet,
  CreditWalletSchema,
} from '../Schemas/wallet_schema/credit-wallet.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersService } from '../users/users.service';
import { Users, UserSchema } from '../Schemas/users_schema/Users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: Users.name, schema: UserSchema },
      { name: Config.name, schema: ConfigSchema },
      { name: WalletTransaction.name, schema: WalletTransactionSchema },
      { name: CreditWallet.name, schema: CreditWalletSchema },
    ]),
    NotificationsModule,
  ],
  controllers: [WalletController],
  providers: [WalletService, UsersService],
  exports: [WalletService],
})
export class WalletModule {}
