import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role } from 'src/Schemas/roles_schema/Role.schema';
import { Users } from 'src/Schemas/users_schema/Users.schema';

// Interface pour les permissions peuplées
interface PopulatedPermission extends String{}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    /* if (!request.user?._id) {
      throw new ForbiddenException('Utilisateur non authentifié');
    }

    const user = await this.userModel
      .findById(request.user._id)
      .populate('role')
      .lean()
      .exec();

    if (!user || !user.role) {
      throw new ForbiddenException('Utilisateur sans rôle');
    } */

      const authHeader = request.headers.authorization;

      if (!authHeader) {
        throw new ForbiddenException('Token manquant');
      }
  
      const token = authHeader.replace('Bearer ', '');
      let decodedToken;
      
      try {
        decodedToken = this.jwtService.verify(token);
        console.log(decodedToken);
      } catch (error) {
        throw new ForbiddenException('Token invalide');
      }
  
      const userId = decodedToken.sub; 
      console.log(userId);
  
      const user = await this.userModel
        .findById(userId)
        .populate('role')
        .lean()
        .exec()

    const roleId = user.role._id.toString();
    const role = await this.roleModel
      .findById(roleId)
      .populate<{ permissions: PopulatedPermission[] }>('permissions') 
      .lean()
      .exec();
      console.log("Le role",role);

    if (!role || !role.permissions) {
      throw new ForbiddenException('Rôle invalide ou sans permissions');
    }

    const userPermissionKeys = role.permissions;
    const hasAllPermissions = requiredPermissions.every(perm => 
      userPermissionKeys.includes(perm)
    );

    console.log("Les permissions",userPermissionKeys);
    
    if (!hasAllPermissions) {
      throw new ForbiddenException('Permissions insuffisantes');
    }

    

    /* if (!hasAllPermissions) {
      throw new ForbiddenException('Permissions insuffisantes');
    } */

    return true;
  }
}