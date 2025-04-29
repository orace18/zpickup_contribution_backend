import { forwardRef, Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from '../Schemas/users_schema/Users.schema';
import { TwilioService } from '../services/twilio.service';
import { WalletModule } from "../wallet/wallet.module";
import { WalletService } from "../wallet/wallet.service";
import { ReferenceHistoryModule } from 'src/reference_history/reference_history.module';
import { GSMNumberFormatModule } from 'src/gsmnumber-format/gsmnumber-format.module';
import { Role, RoleSchema } from 'src/Schemas/roles_schema/Role.schema';
import { RoleModule } from 'src/roles/roles.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Config, ConfigSchema } from 'src/Schemas/config_schema/config.schema';
import { Zems, ZemsSchema } from 'src/Schemas/zems_schema/Zems.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema },
    { name: Role.name, schema: RoleSchema },
    { name: Config.name, schema: ConfigSchema },
    { name: Zems.name, schema: ZemsSchema },
    ]),
    forwardRef(() => WalletModule),
    forwardRef(() => ReferenceHistoryModule),
    forwardRef(() => RoleModule),
    forwardRef(() => UsersModule),
    GSMNumberFormatModule,
    RoleModule,
    JwtModule.registerAsync({
      imports: undefined,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '730h', algorithm: 'HS256' },
      })
    }),

  ],
  controllers: [UsersController],
  providers: [UsersService, TwilioService],
  exports: [UsersService],
})
export class UsersModule { }
