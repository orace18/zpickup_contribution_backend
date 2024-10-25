import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from './customers/customers.module';
import { ZemsModule } from './zems/zems.module';
import { CoursesModule } from './courses/courses.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
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

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://zpickupbenin:vkbRRdlXU75t5SVi@cluster0.bk6kf.mongodb.net/'),
    UsersModule,
    CustomersModule,
    ZemsModule,
    CoursesModule,
    PasswordResetModule,
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
    ActivationHistoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
