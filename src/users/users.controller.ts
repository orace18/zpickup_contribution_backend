import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, HttpException, HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TwilioService } from '../services/twilio.service';
import { UserType } from '../Schemas/users_schema/Users.schema';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly twilioService: TwilioService,
  ) {}

  @Post('register/phone_number')
  async registerWithPhoneNumber(@Body() {phone_number}: {phone_number: string}) {
    // on vérifie si le numéro de téléphone existe déjà
    const existingUser = await this.usersService.findByPhone(phone_number);
    if (existingUser) {
      throw new HttpException('Ce numéro de téléphone est déjà attribué à un compte', HttpStatus.BAD_REQUEST);
    }

    // Généreration d'un code de vérification (6 chiffres)
    const verification_code = Math.floor(100000 + Math.random() * 900000).toString();

    // Envoie du code par SMS
    /*const sms_sent = await this.twilioService.sendVerificationCode(phone_number, verification_code);
    if (!sms_sent) {
      throw new HttpException('Erreur lors de l\'envoi du SMS', HttpStatus.INTERNAL_SERVER_ERROR);
    }*/

    // Création d'un utilisateur temporaire avec le minimum d'informations
    const user = await this.usersService.createTemporary({
      phone_number,
      verification_code: verification_code,
      user_type: UserType.CUSTOMER,
      created_at: new Date(),
      updated_at: new Date()
    });

    return { message: 'Code de vérification envoyé' };
  }

  @Post('verify-code')
  async verifyCode(
    @Body() { phone_number, verification_code }: { phone_number: string; verification_code: string }
  ) {
    const user = await this.usersService.findByPhone(phone_number);
    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }

    if (user.verification_code !== verification_code) {
      throw new HttpException('Code de vérification incorrect', HttpStatus.BAD_REQUEST);
    }

    // Mise à jour de `validated_at` et suppression de `verification_code`
    await this.usersService.update(user._id.toString(), {
      validated_at: new Date(),
      verification_code: null
    });

    return { message: 'Code vérifié avec succès' };
  }

  /*@Post('complete-registration')
  async completeRegistration(
    @Body() createUserDto: CreateUserDto
  ) {
    const user = await this.usersService.findByPhone(createUserDto.phone_number);
    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }

    // Mettre à jour l'utilisateur avec toutes les informations
    const updatedUser = await this.usersService.update(user._id.toString(), {
      ...createUserDto,
      validated_at: new Date(),
      updated_at: new Date()
    });

    return updatedUser;
  }*/

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('complete-registration/:id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    // Vérifiez si l'utilisateur existe
    const user = this.usersService.findOne(id);
    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }

    // Mettez à jour l'utilisateur avec les informations reçues dans updateUserDto
    const updatedUser = await this.usersService.update(id, {
      ...updateUserDto,
      updated_at: new Date(),
    });

    return updatedUser;
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
