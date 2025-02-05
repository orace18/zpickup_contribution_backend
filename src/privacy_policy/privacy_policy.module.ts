import { Module } from '@nestjs/common';
import { PrivacyPolicyService } from './privacy_policy.service';
import { PrivacyPolicyController } from './privacy_policy.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PrivacyPolicy } from './entities/privacy_policy.entity';
import { PrivacyPolicySchema } from 'src/Schemas/privacy_policy_schema/privacy_policy.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PrivacyPolicy.name, schema: PrivacyPolicySchema }])
  ],
  controllers: [PrivacyPolicyController],
  providers: [PrivacyPolicyService],
})
export class PrivacyPolicyModule {}
