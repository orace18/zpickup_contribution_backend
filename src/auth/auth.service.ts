import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validatedUser(phone_number: string, password: string): Promise<any> {
    const user = await this.usersService.findByPhone(phone_number);

    if (!user) {
      return null;
    }

    // on vérifie si le compte est validé
    if (!user.validated_at) {
      throw new UnauthorizedException('Compte non validé');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    const { password: _, verification_code: __, ...result } = user;
    return result;
  }

  async login(user: any) {

    console.log('Login user input:', user);

    // Accéder aux données via _doc
    const userData = user._doc || user;
    console.log('User data:', userData);

    if (!userData || !userData._id) {
      throw new HttpException(
        'Données utilisateur invalides',
        HttpStatus.BAD_REQUEST
      );
    }

    const payload = {
      sub: userData._id.toString(),
      phone_number: userData.phone_number,
    };

    console.log('Generated payload:', payload);

    return {
      access_token: this.jwtService.sign(payload),
      user: userData
    };
  }
}
