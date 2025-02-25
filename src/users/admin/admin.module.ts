import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Users, UserSchema } from '../../Schemas/users_schema/Users.schema';
import { Role, RoleSchema } from '../../Schemas/roles_schema/Role.schema';
import { UsersModule } from '../users.module';
import { RoleModule } from '../../roles/roles.module';
import { RoleService } from '../../roles/roles.service';
import { Permission, PermissionSchema } from '../../Schemas/permission_schema/Permission.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


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
      { name: Users.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema }
    ]),
    RoleModule,
    UsersModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, RoleService],
  exports: [AdminService],
})
export class AdminModule {}