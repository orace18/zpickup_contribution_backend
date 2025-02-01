// Dans jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret_jwt', // utilisez votre clé secrète
    });
  }

  async validate(payload: any) {
    console.log('JWT Payload:', payload);
    return {
      userId: payload.sub,
      phone_number: payload.phone_number // optionnel
    };
  }
}