import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    const payload = {
      phone: user.phone_number,
      sub: user._id,
      type: user.user_type,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        phone_number: user.phone_number,
        user_type: user.user_type,
      },
    };
  }
}
