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
import { AdminAuthModule } from './auth/admin/admin.module';
import { AdminModule } from './users/admin/admin.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './roles/roles.module';
import { SeedsModule } from './seeds/seed.module';
import { RacesModule } from './races/races.module';
import { PaymentModule } from './payment/payment.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { notificationConfig } from './notifications/notification.config';
import { ReferenceHistoryModule } from './reference_history/reference_history.module';
import { MessageModule } from './message/message.module';
import { RaceHistoryModule } from './race_history/race_history.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://zpickupbenin:vkbRRdlXU75t5SVi@cluster0.bk6kf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      //'mongodb+srv://zpickupbenin:KvhHqBHmEMItQLie@cluster0.vd0hs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [notificationConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Chemin vers le dossier uploads
      serveRoot: '/uploads', // URL pour accéder aux fichiers
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
    ActivationHistoryModule,
    SeedsModule,
    RacesModule,
    CounterModule,
    PaymentModule,
    NotificationsModule,
    RoleModule,
    PermissionModule,
    AdminModule,
    AdminAuthModule,
    ReferenceHistoryModule,
    MessageModule,
    RaceHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
