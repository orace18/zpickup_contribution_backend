import { Controller, Post, UseGuards, Request, Body, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validatedUser(loginDto.phone_number, loginDto.password);
    if (!user) {
      throw new HttpException(
        'Identifiants invalides',
        HttpStatus.UNAUTHORIZED
      );
    }
    return this.authService.login(user);
  }
}