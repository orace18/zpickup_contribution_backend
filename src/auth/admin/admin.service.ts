import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminService } from '../../users/admin/admin.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly usersService: AdminService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    console.log('JWT_SECRET présent:', !!this.configService.get('JWT_SECRET'));
  }

  async validateUser(mail: string, password: string): Promise<any> {
    console.log('=== Début de la validation utilisateur ===');
    console.log('Email fourni:', mail);
    console.log('Mot de passe fourni (longueur):', password?.length);

    const admin = await this.usersService.findByMail(mail);
    if (!admin) {
      console.log('❌ Aucun admin trouvé avec cet email');
      throw new UnauthorizedException('Identifiants invalides');
    }

    console.log('✓ Admin trouvé dans la base de données');
    console.log('Détails admin:', {
      id: admin._id,
      email: admin.email_address,
      hasPassword: !!admin.password,
      passwordLength: admin.password?.length,
      userType: admin.user_type,
      hasRole: !!admin.role
    });

    if (!admin.password) {
      console.log('❌ Pas de mot de passe défini pour cet admin');
      throw new UnauthorizedException('Compte non configuré correctement');
    }

    try {
      console.log('=== Début de la comparaison des mots de passe ===');
      console.log('Format du mot de passe stocké:', {
        length: admin.password.length,
        startsWithDollar: admin.password.startsWith('$'),
        rounds: admin.password.split('$')[2]
      });

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      console.log('Résultat de la comparaison:', isPasswordValid ? '✓ Valide' : '❌ Invalide');

      if (!isPasswordValid) {
        console.log('❌ Échec de la validation du mot de passe');
        throw new UnauthorizedException('Identifiants invalides');
      }

      console.log('✓ Authentification réussie');
      const result = {
        _id: admin._id,
        phone_number: admin.phone_number,
        email_address: admin.email_address,
        user_type: admin.user_type,
        role: admin.role
      };

      console.log('Données utilisateur préparées pour le token:', {
        hasId: !!result._id,
        hasPhone: !!result.phone_number,
        hasEmail: !!result.email_address,
        userType: result.user_type,
        hasRole: !!result.role
      });

      return result;
    } catch (error) {
      console.error('❌ Erreur lors de la comparaison des mots de passe:', {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack
      });
      throw new UnauthorizedException('Erreur lors de la vérification des identifiants');
    }
  }

  async login(user: any) {
    console.log('=== Début du processus de login ===');

    if (!user?.phone_number || !user?._id || !user?.user_type || !user?.role) {
      console.log('❌ Données utilisateur manquantes:', {
        hasPhone: !!user?.phone_number,
        hasId: !!user?._id,
        hasType: !!user?.user_type,
        hasRole: !!user?.role
      });
      throw new Error('Missing required user data');
    }

    const payload = {
      phone: user.phone_number,
      sub: user._id,
      type: user.user_type,
      role: user.role
    };

    console.log('Payload préparé pour le token:', {
      hasPhone: !!payload.phone,
      hasSubject: !!payload.sub,
      type: payload.type,
      hasRole: !!payload.role
    });

    try {
      const token = this.jwtService.sign(payload);
      console.log('✓ Token généré avec succès');

      const response = {
        access_token: token,
        user: {
          _id: user._id,
          phone_number: user.phone_number,
          email_address: user.email_address,
          user_type: user.user_type,
          role: user.role
        }
      };

      console.log('✓ Réponse de login préparée avec succès');
      return response;
    } catch (error) {
      console.error('❌ Erreur lors de la génération du token:', {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack
      });
      throw error;
    }
  }
}