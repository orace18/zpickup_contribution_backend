import {forwardRef, Module} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from '../Schemas/users_schema/Users.schema';
import { TwilioService } from '../services/twilio.service';
import {WalletModule} from "../wallet/wallet.module";
import {WalletService} from "../wallet/wallet.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]),
    forwardRef(() => WalletModule)

  ],
  controllers: [UsersController],
  providers: [UsersService, TwilioService],
  exports: [UsersService],
})
export class UsersModule {}
