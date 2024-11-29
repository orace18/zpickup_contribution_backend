import * as twilio from 'twilio';
import { Injectable } from '@nestjs/common';
import * as process from 'node:process';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwilioService {
  private client: twilio.Twilio;

  constructor(private configService: ConfigService) {
    this.client = twilio(
      this.configService.get<string>('TWILIO_ACCOUNT_SID'),
      this.configService.get<string>('TWILIO_AUTH_TOKEN')
    );
  }

  async sendVerificationCode(phoneNumber: string, code: string): Promise<boolean> {
    try {
      await this.client.messages.create({
        body:`Votre code de vérification est ${code}`,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        to: phoneNumber,
      });
      return true;
    } catch (error) {
      console.error('Twilio error:', error);
      return false;
    }
  }
}