import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '../../Schemas/users_schema/Users.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Récupérer les rôles requis depuis les métadonnées
    const requiredRoles = this.reflector.get<UserType[]>('roles', context.getHandler());
    
    // Si aucun rôle n'est spécifié, autoriser l'accès
    if (!requiredRoles || requiredRoles.length === 0) {
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
      
      // Vérifie si le type d'utilisateur est présent dans le token
      if (!payload.user_type) {
        throw new ForbiddenException('Type d\'utilisateur non trouvé dans le token');
      }

      // Vérifie si le type d'utilisateur est inclus dans les rôles requis
      const hasRole = requiredRoles.includes(payload.user_type);
      
      if (!hasRole) {
        throw new ForbiddenException(`Accès refusé. Rôles autorisés: ${requiredRoles.join(', ')}`);
      }
      
      // Attache les informations utilisateur à la requête pour usage ultérieur
      request.user = {
        ...payload,
        user_type: payload.user_type
      };

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Token invalide ou expiré');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}