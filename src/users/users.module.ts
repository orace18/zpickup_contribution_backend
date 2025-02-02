import {forwardRef, Global, Module} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from '../Schemas/users_schema/Users.schema';
import { TwilioService } from '../services/twilio.service';
import {WalletModule} from "../wallet/wallet.module";
import {WalletService} from "../wallet/wallet.service";
import { ReferenceHistoryModule } from 'src/reference_history/reference_history.module';
import { GSMNumberFormatModule } from 'src/gsmnumber-format/gsmnumber-format.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]),
    forwardRef(() => WalletModule),
    forwardRef(() => ReferenceHistoryModule),
    GSMNumberFormatModule,

  ],
  controllers: [UsersController],
  providers: [UsersService, TwilioService],
  exports: [UsersService],
})
export class UsersModule {}
