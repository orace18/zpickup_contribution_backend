import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSeeder } from './role/role.seeder';
import { PermissionSeeder } from './permission/permission.seeder';
import { Config, ConfigSchema } from '../Schemas/config_schema/config.schema';
import { FAQ, FAQSchema } from 'src/Schemas/FAQ_schema/FAQ.schema';
import { FaqSeeder } from './faq/faq.seeder';
import { Role, RoleSchema } from '../Schemas/roles_schema/Role.schema';
import { Permission, PermissionSchema } from '../Schemas/permission_schema/Permission.schema';
import { Users, UserSchema } from '../Schemas/users_schema/Users.schema';
import { ConfigSeeder } from './config/config.seeder';
import { AdminSeeder } from './admin_user/admin_user.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }, { name: FAQ.name, schema: FAQSchema }]),
    MongooseModule.forFeature([
      { name: Config.name, schema: ConfigSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Users.name, schema: UserSchema }
    ]),
  ],
  providers: [ConfigSeeder,RoleSeeder, PermissionSeeder, FaqSeeder, AdminSeeder],
  exports: [ConfigSeeder,RoleSeeder, PermissionSeeder, FaqSeeder, AdminSeeder],
})
export class SeedsModule {}
