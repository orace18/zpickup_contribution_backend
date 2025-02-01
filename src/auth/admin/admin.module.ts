import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminAuthService } from './admin.service';
import { AdminAuthController } from './admin.controller';
import { UsersModule } from '../../users/users.module';
import { AdminModule } from '../../users/admin/admin.module';
import { AdminService } from '../../users/admin/admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from '../../Schemas/users_schema/Users.schema';
import { Role, RoleSchema } from '../../Schemas/roles_schema/Role.schema';
import { ConfigService } from '@nestjs/config';
import { RoleModule } from '../../roles/roles.module';
import { RoleService } from '../../roles/roles.service';
import { Permission, PermissionSchema } from '../../Schemas/permission_schema/Permission.schema';
import { PermissionModule } from '../../permission/permission.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Users.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema }
    ]),
    UsersModule,
    AdminModule,
    RoleModule,
    PermissionModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: undefined,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h', algorithm: 'HS256' },
      })
    }),
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, AdminService, RoleService],
})
export class AdminAuthModule {}
