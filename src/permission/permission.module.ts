import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from '../Schemas/permission_schema/Permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }]),
  ],
  exports: [MongooseModule], 
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
