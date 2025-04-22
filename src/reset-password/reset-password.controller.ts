import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { SendCodeDto } from './dto/send-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordService } from './reset-password.service';

@Controller('reset-password')
export class ResetPasswordController {

  constructor(private readonly passwordResetService: ResetPasswordService) { }

  @Post('send-code')
  async sendVerificationCode(@Body() sendCodeDto: SendCodeDto) {
    try {
      return await this.passwordResetService.sendVerificationCode(sendCodeDto.email);
    } catch (error) {
      throw new HttpException(
        error.message || 'Une erreur est survenue',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('verify-code')
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    try {
      return await this.passwordResetService.verifyCode(
        verifyCodeDto.email,
        verifyCodeDto.code,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Une erreur est survenue',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('reset')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      return await this.passwordResetService.resetPassword(
        resetPasswordDto.email,
        resetPasswordDto.code,
        resetPasswordDto.password,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Une erreur est survenue',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
