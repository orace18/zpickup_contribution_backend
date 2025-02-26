import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalPhoneStrategy } from './strategies/local-phone.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'local' }),
    JwtModule.registerAsync({
      imports: undefined,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '730h', algorithm: 'HS256' },
        })
      }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalPhoneStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}