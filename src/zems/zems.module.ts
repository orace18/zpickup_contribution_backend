import { Module, forwardRef } from '@nestjs/common';
import { ZemsService } from './zems.service';
import { ZemsController } from './zems.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Zems, ZemsSchema } from '../Schemas/zems_schema/Zems.schema';
import { ZemValidationService } from './zem-validation.service';
import { CounterModule } from '../counter/counter.module';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { Config, ConfigSchema } from "../Schemas/config_schema/config.schema";
import { Races, RacesSchema } from "../Schemas/races_schema/races.schema";
import { WalletModule } from "../wallet/wallet.module";
import { ReferenceHistoryModule } from '../reference_history/reference_history.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ReferenceHistory, ReferenceHistorySchema } from 'src/Schemas/reference_history_schema/reference_history_schema.schema';
import { Wallet, WalletSchema } from 'src/Schemas/wallet_schema/wallet.schema';
import { WalletHistoryModule } from 'src/wallet-history/wallet-history.module';
import { WalletHistory, WalletHistorySchema } from 'src/Schemas/wallet-history_schema/wallet_history.schema';
import { Users, UsersSchema } from 'src/Schemas/users_schema/Users.schema';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: undefined,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '730h', algorithm: 'HS256' },
        })
      }),
    MongooseModule.forFeature([
      { name: Zems.name, schema: ZemsSchema },
      { name: Users.name, schema: UsersSchema },
      { name: Config.name, schema: ConfigSchema },
      { name: Races.name, schema: RacesSchema },
      { name: ReferenceHistory.name, schema: ReferenceHistorySchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: WalletHistory.name, schema: WalletHistorySchema },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => WalletModule),
    forwardRef(() => ReferenceHistoryModule),
    
    CounterModule,
    NotificationsModule,
  ],
  controllers: [ZemsController],
  providers: [
    ZemsService,
    ZemValidationService
  ],
  exports: [ZemsService],
})
export class ZemsModule {}