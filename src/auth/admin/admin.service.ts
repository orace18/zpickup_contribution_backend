import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminService } from '../../users/admin/admin.service';
import { ConfigService } from '@nestjs/config';
import { first, last } from 'rxjs';

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
  

    const admin = await this.usersService.findByMail(mail);
    if (!admin) {
    
      throw new UnauthorizedException('Identifiants invalides');
    }

    if (!admin.password) {
      throw new UnauthorizedException('Compte non configuré correctement');
    }

    try {

      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Identifiants invalides');
      }


      const result = {
        _id: admin._id,
        firstname: admin.firstname,
        lastname: admin.lastname,
        phone_number: admin.phone_number,
        email_address: admin.email_address,
        user_type: admin.user_type,
        role: admin.role
      };



      return result;
    } catch (error) {
      throw new UnauthorizedException('Erreur lors de la vérification des identifiants');
    }
  }

  async login(user: any) {

    if (!user?.phone_number || !user?._id || !user?.user_type || !user?.role) {

      throw new Error('Missing required user data');
    }

    const payload = {
      phone: user.phone_number,
      sub: user._id,
      user_type: user.user_type,
      role: user.role
    };



    try {
      const token = this.jwtService.sign(payload);

      const response = {
        access_token: token,
        user: {
          _id: user._id,
          lastname: user.lastname,
          firstname: user.firstname,
          phone_number: user.phone_number,
          email_address: user.email_address,
          user_type: user.user_type,
          role: user.role
        }
      };

      return response;
    } catch (error) {
     
      throw error;
    }
  }
}