/* import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserType } from '../../Schemas/users_schema/Users.schema';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserType[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Utilisateur non authentifié');
    }

    if (!user.user_type || !requiredRoles.includes(user.user_type)) {
      throw new ForbiddenException(`Rôle requis: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
 */

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/Schemas/roles_schema/Role.schema';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @InjectModel(Role.name) private roleModel: Model<Role>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new ForbiddenException('Token non fourni');
    }

    try {
      // Décode le token
      const payload = await this.jwtService.verifyAsync(token);
      
      // Vérifie si le rôle existe dans le token
      if (!payload.role) {
        throw new ForbiddenException('Aucun rôle trouvé dans le token');
      }

      // Récupère le rôle complet depuis la base de données
      const userRole = await this.roleModel.findById(payload.role).populate('permissions');
      
      if (!userRole) {
        throw new ForbiddenException('Rôle non trouvé');
      }

      // Attache le rôle à la requête pour une utilisation ultérieure si nécessaire
      request['userRole'] = userRole;

      // Vérifie si le rôle de l'utilisateur correspond à l'un des rôles requis
      return requiredRoles.includes(userRole.name);
    } catch (error) {
      throw new ForbiddenException('Token invalide ou expiré');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}