import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from './customers/customers.module';
import { ZemsModule } from './zems/zems.module';
import { CnssModule } from './cnss/cnss.module';
import { InsurancesModule } from './insurances/insurances.module';
import { CounterModule } from './counter/counter.module';
import { PenaltiesModule } from './penalties/penalties.module';
import { SponsorshipModule } from './sponsorship/sponsorship.module';
import { FaqModule } from './faq/faq.module';
import { ConfigsModule } from './configs/configs.module';
import { CounterHistoryModule } from './counter-history/counter-history.module';
import { WalletHistoryModule } from './wallet-history/wallet-history.module';
import { WalletModule } from './wallet/wallet.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ActivationHistoryModule } from './activation_history/activation_history.module';
import { ConfigModule } from '@nestjs/config';
import {SeedsModule} from "./seeds/seed.module";
import { RacesModule } from './races/races.module';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://zpickupbenin:vkbRRdlXU75t5SVi@cluster0.bk6kf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    CustomersModule,
    ZemsModule,
    CnssModule,
    InsurancesModule,
    CounterModule,
    PenaltiesModule,
    SponsorshipModule,
    FaqModule,
    ConfigsModule,
    CounterHistoryModule,
    WalletHistoryModule,
    WalletModule,
    NotificationsModule,
    ActivationHistoryModule,
    SeedsModule,
    RacesModule,
    CounterModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService, WebsocketGateway],
})
export class AppModule {}
