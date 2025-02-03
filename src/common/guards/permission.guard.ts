import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role } from 'src/Schemas/roles_schema/Role.schema';
import { Users } from 'src/Schemas/users_schema/Users.schema';

// Interface pour les permissions peuplées
interface PopulatedPermission {
  _id: Types.ObjectId;
  key: string;
  name: string;
  description: string;
  group: string;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if (!request.user?._id) {
      throw new ForbiddenException('Utilisateur non authentifié');
    }

    const user = await this.userModel
      .findById(request.user._id)
      .populate('role')
      .lean()
      .exec();

    if (!user || !user.role) {
      throw new ForbiddenException('Utilisateur sans rôle');
    }

    const roleId = user.role._id.toString();
    const role = await this.roleModel
      .findById(roleId)
      .populate<{ permissions: PopulatedPermission[] }>('permissions') // Spécifier le type pour populate
      .lean()
      .exec();

    if (!role || !role.permissions) {
      throw new ForbiddenException('Rôle invalide ou sans permissions');
    }

    const userPermissions = (role.permissions as PopulatedPermission[]).map(perm => perm.key);
    const hasAllPermissions = requiredPermissions.every(perm =>
      userPermissions.includes(perm)
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException('Permissions insuffisantes');
    }

    return true;
  }
}