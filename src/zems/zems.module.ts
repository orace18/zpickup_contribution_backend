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
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Créer le répertoire des contrats s'il n'existe pas
const contractsDir = './uploads/contracts';
if (!fs.existsSync(contractsDir)) {
  fs.mkdirSync(contractsDir, { recursive: true });
}

@Module({
  imports: [
    JwtModule.registerAsync({
              imports: undefined,
              inject: [ConfigService],
              useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '24h', algorithm: 'HS256' },
              })
            }),
    MongooseModule.forFeature([
      { name: Zems.name, schema: ZemsSchema },
      { name: Config.name, schema: ConfigSchema },
      { name: Races.name, schema: RacesSchema }
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${file.fieldname}-${uniqueSuffix}${file.originalname.slice(file.originalname.lastIndexOf('.'))}`);
        },
      }),
    }),
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