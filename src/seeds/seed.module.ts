import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSeeder } from './role/role.seeder';
import { PermissionSeeder } from './permission/permission.seeder';
import { Config, ConfigSchema } from '../Schemas/config_schema/config.schema';
import { FAQ, FAQSchema } from 'src/Schemas/FAQ_schema/FAQ.schema';
import { FaqSeeder } from './faq/faq.seeder';
import { Role, RoleSchema } from '../Schemas/roles_schema/Role.schema';
import { Permission, PermissionSchema } from '../Schemas/permission_schema/Permission.schema';
import { Users, UsersSchema } from '../Schemas/users_schema/Users.schema';
import { ConfigSeeder } from './config/config.seeder';
import { AdminSeeder } from './admin_user/admin_user.seeder';
import { GSMNumberFormat, GSMNumberFormatSchema } from 'src/Schemas/gsm_number_format_schema/gsm_number_format.schema';
import { GmsSeeder } from './gms/gsm.seeder';
import { TermsConditions, TermsConditionsSchema } from 'src/Schemas/terms_conditions_schema/terms_conditions.schema';
import { PrivacyPolicy } from 'src/privacy_policy/entities/privacy_policy.entity';
import { PrivacyPolicySchema } from 'src/Schemas/privacy_policy_schema/privacy_policy.schema';
import { TermsConditionsSeeder } from './terms_conditions/terms-conditions.seeder';
import { PrivacyPolicySeeder } from './privacy_policy/privacy-policy.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Config.name, schema: ConfigSchema },
      { name: FAQ.name, schema: FAQSchema },
      { name: GSMNumberFormat.name, schema: GSMNumberFormatSchema },
      { name: TermsConditions.name, schema: TermsConditionsSchema },
      { name: PrivacyPolicy.name, schema: PrivacyPolicySchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Users.name, schema: UsersSchema },


    ]),
  ],
  providers: [ConfigSeeder, RoleSeeder, PermissionSeeder, FaqSeeder, AdminSeeder, GmsSeeder,TermsConditionsSeeder,PrivacyPolicySeeder],
  exports: [ConfigSeeder, RoleSeeder, PermissionSeeder, FaqSeeder, AdminSeeder, GmsSeeder,TermsConditionsSeeder,PrivacyPolicySeeder],
})
export class SeedsModule { }
