import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleController } from './roles.controller';
import { RoleService } from './roles.service';
import { Role, RoleSchema } from '../Schemas/roles_schema/Role.schema';
import { Permission, PermissionSchema } from '../Schemas/permission_schema/Permission.schema';
import { Users, UsersSchema } from '../Schemas/users_schema/Users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Users.name, schema: UsersSchema },
    ]),

  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports :[RoleService]
})
export class RoleModule {}
