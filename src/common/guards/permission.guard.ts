import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/Schemas/roles_schema/Role.schema';
import { Users } from 'src/Schemas/users_schema/Users.schema';

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
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new ForbiddenException('Token manquant');
    }

    const token = authHeader.replace('Bearer ', '');
    let decodedToken;
    
    try {
      decodedToken = this.jwtService.verify(token);
    } catch (error) {
      throw new ForbiddenException('Token invalide');
    }

    const userId = decodedToken.sub;
    if (!userId) {
      throw new ForbiddenException('Token invalide: identifiant utilisateur manquant');
    }

    // Trouver l'utilisateur et peupler le rôle
    const user = await this.userModel
      .findById(userId)
      .populate('role')
      .lean()
      .exec();

    if (!user) {
      throw new ForbiddenException(`Utilisateur non trouvé pour l'ID: ${userId}`);
    }

    if (!user.role) {
      throw new ForbiddenException(`L'utilisateur n'a pas de rôle associé`);
    }

    // Vérifier que le rôle est un objet avec un _id
    if (!user.role._id) {
      throw new ForbiddenException('Format de rôle invalide');
    }

    const roleId = user.role._id.toString();
    
    // Récupérer le rôle avec les permissions
    const role = await this.roleModel
      .findById(roleId)
      .populate<{ permissions: PopulatedPermission[] }>('permissions') 
      .lean()
      .exec();

    if (!role) {
      throw new ForbiddenException(`Rôle non trouvé pour l'ID: ${roleId}`);
    }

    if (!role.permissions || !Array.isArray(role.permissions)) {
      throw new ForbiddenException('Le rôle n\'a pas de permissions valides');
    }

    // Vérifier les permissions
    const userPermissionKeys = role.permissions;
    const hasAllPermissions = requiredPermissions.every(perm => 
      userPermissionKeys.includes(perm)
    );
    
    if (!hasAllPermissions) {
      throw new ForbiddenException(`Permissions insuffisantes. Requises: ${requiredPermissions.join(', ')}`);
    }

    return true;
  }
}