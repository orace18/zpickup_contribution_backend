import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VerificationCode, VerificationCodeSchema } from 'src/Schemas/verification_code_schema/verification-code.schema';
import { MailModule } from 'src/mail/mail.module';

import { AdminModule } from 'src/users/admin/admin.module';

@Module({
  imports: [
    AdminModule,
    MailModule,
    MongooseModule.forFeature([
      { name: VerificationCode.name, schema: VerificationCodeSchema }
    ])
  ],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService],
  exports: [ResetPasswordService]
})
export class ResetPasswordModule {}
