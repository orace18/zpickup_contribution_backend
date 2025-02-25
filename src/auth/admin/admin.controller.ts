import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import {  AdminAuthService } from './admin.service';
import { AdminLoginDto } from '../dto/admin_login.dto';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}


  @Post('login')
  async login(@Body(ValidationPipe) loginDto: AdminLoginDto) {
    const user = await this.adminAuthService.validateUser(
      loginDto.email_address,
      loginDto.password
    );
    return this.adminAuthService.login(user);
  }

}
