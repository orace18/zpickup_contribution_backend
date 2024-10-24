import { Module } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { PasswordResetController } from './password-reset.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordReset, PasswordResetSchema } from '../Schemas/password_reset_schema/password_reset.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: PasswordReset.name, schema: PasswordResetSchema}])
  ],
  controllers: [PasswordResetController],
  providers: [PasswordResetService],
})
export class PasswordResetModule {}
