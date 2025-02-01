import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from '../Schemas/permission_schema/Permission.schema';

@Controller('permissions')
export class PermissionController {
  constructor(
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
  ) {}

  @Get('grouped')
  async getGroupedPermissions() {
    // Récupérer toutes les permissions
    const permissions = await this.permissionModel.find().lean();

    // Organiser les permissions par groupe
    const groupedPermissions = permissions.reduce((acc, permission) => {
      const group = permission.group;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(permission);
      return acc;
    }, {});

    return groupedPermissions;
  }
}
