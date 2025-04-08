import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { TwilioService } from '../services/twilio.service';
import { UserType } from '../Schemas/users_schema/Users.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { sendSMSLetexto } from '../services/helpers.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReferenceHistoryService } from 'src/reference_history/reference_history.service';
import { GSMNumberFormatService } from 'src/gsmnumber-format/gsmnumber-format.service';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { unlink } from 'fs/promises';
import { PermissionsGuard } from 'src/common/guards/permission.guard';
import { RequiredRoles } from 'src/common/decorators/role.decorator';

@Controller('users')
@UseGuards(PermissionsGuard)
@RequiredRoles(UserType.ADMIN, UserType.ZEM, UserType.CUSTOMER)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly twilioService: TwilioService,
    private readonly referenceHistoryService: ReferenceHistoryService,
    private readonly gsmNumberFormatService: GSMNumberFormatService,
  ) {}

  @Post('register/phone_number')
  async registerWithPhoneNumber(
    @Body() { phone_number }: { phone_number: string },
  ) {
    // Vérification des caractères spéciaux et lettres
    if (!/^\+?\d+$/.test(phone_number)) {
      throw new HttpException(
        'Le numéro de téléphone ne doit contenir que des chiffres',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Vérification du format GSM béninois
    const isValidPrefix =
      await this.gsmNumberFormatService.isValidPrefix(phone_number);
    if (!isValidPrefix) {
      throw new HttpException(
        "Le format du numéro de téléphone n'est pas valide",
        HttpStatus.BAD_REQUEST,
      );
    }

    // on vérifie si le numéro de téléphone existe déjà avec un compte validé
    const existingUser = await this.usersService.findByPhone(
      phone_number,
      true,
    );
    if (existingUser && existingUser.validated_at) {
      throw new HttpException(
        'Ce numéro de téléphone est déjà attribué à un compte',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Généreration d'un code de vérification (6 chiffres)

    let verification_code: string;
    let isUnique = false;

    // Boucle pour générer un code unique
    while (!isUnique) {
      verification_code = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      const existingCode =
        await this.usersService.findByVerificationCode(verification_code);
      if (!existingCode) {
        isUnique = true; // Si le code n'est pas utilisé, on arrête la boucle
      }
    }

    try {
      // Envoie du code par SMS
      sendSMSLetexto(
        'Votre code de vérification ZPickup : ' + verification_code,
        phone_number,
      );
    } catch (error) {
      console.error(error);
    }

    // Création d'un utilisateur temporaire avec le minimum d'informations
    const user = await this.usersService.createTemporary({
      phone_number,
      verification_code: verification_code,
      user_type: UserType.CUSTOMER,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return { message: 'Code de vérification envoyé' };
  }

  @Post('verify-phone/send-code')
  async verifyPhoneAndSendCode(
    @Body() { phone_number }: { phone_number: string },
  ) {
    const user = await this.usersService.findByPhone(phone_number);

    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }

    let verification_code: string;
    let isUnique = false;

    while (!isUnique) {
      verification_code = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      const existingCode =
        await this.usersService.findByVerificationCode(verification_code);
      if (!existingCode) {
        isUnique = true;
      }
    }

    await this.usersService.update(user._id.toString(), { verification_code });

    // Envoie du code par SMS
    sendSMSLetexto(
      'Votre code de vérification ZPickup : ' + verification_code,
      phone_number,
    );

    return { message: 'Code de vérification envoyé' };
  }

  @Post('verify-code')
  async verifyCode(
    @Body()
    {
      phone_number,
      verification_code,
    }: {
      phone_number: string;
      verification_code: string;
    },
  ) {
    const user = await this.usersService.findByPhone(phone_number, false);

    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }

    console.log('Code reçu:', verification_code);
    console.log('Code stocké:', user.verification_code);

    if (
      !user.verification_code ||
      user.verification_code !== verification_code
    ) {
      throw new HttpException(
        'Code de vérification incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Mise à jour de `validated_at` et suppression de `verification_code`
    const updatedUser = await this.usersService.update(user._id.toString(), {
      validated_at: new Date(),
      verification_code: null,
    });

    if (!updatedUser) {
      throw new HttpException(
        'Erreur lors de la validation du compte',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { message: 'Code vérifié avec succès', userId: user._id };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Request() req) {
    try {
      const userId = req.user.userId; // Récupère l'ID du payload validé

      const user = await this.usersService.findOne(userId);

      if (!user) {
        throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      console.error('Erreur dans getCurrentUser:', error);
      throw new HttpException(
        {
          message: error.message || 'Une erreur est survenue',
          details: error.response || error,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('complete-registration/:id')
  @UseInterceptors(
    FileInterceptor('user_profile_image', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `user_profile_image-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new Error('Seuls les fichiers jpg, jpeg et png sont autorisés!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
      }

      if (file) {
        // Supprimer l'ancienne image si elle existe
        if (user.user_profile_image) {
          try {
            await unlink(join(process.cwd(), user.user_profile_image));
          } catch (error) {
            console.log(
              "Erreur lors de la suppression de l'ancienne image:",
              error,
            );
          }
        }
        updateUserDto.user_profile_image = file.path.replace(/\\/g, '/');
      }

      // Générer un code de parrainage unique si l'utilisateur n'en a pas
      if (!user.sponsorship_code) {
        const sponsorship_code = await this.usersService.generateUniqueCode();
        updateUserDto.sponsorship_code = sponsorship_code;
      }

      // Gérer le code de parrainage si fourni
      if (updateUserDto.referal_code) {
        // Utiliser findBySponsorshipCode au lieu de findOne
        const referrer = await this.usersService.findBySponsorshipCode(
          updateUserDto.referal_code,
        );

        if (referrer) {
          await this.referenceHistoryService.createReferenceHistory(
            referrer._id.toString(),
            id,
          );
        } else {
          throw new HttpException(
            'Code de parrainage invalide',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // Mettre à jour l'utilisateur
      await this.usersService.update(id, {
        ...updateUserDto,
        updated_at: new Date(),
      });

      // Récupérer l'utilisateur mis à jour avec toutes ses informations
      const updatedUser = await this.usersService.findOne(id);
      if (!updatedUser) {
        throw new HttpException(
          'Erreur lors de la mise à jour',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return updatedUser;
    } catch (error) {
      throw new HttpException(
        error.message || 'Une erreur est survenue',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('forgot-password/send-code')
  async sendVerificationCode(
    @Body() { phone_number }: { phone_number: string },
  ) {
    const user = await this.usersService.findByPhone(phone_number);

    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }

    // Génération d'un code unique
    let verification_code: string;
    let isUnique = false;

    while (!isUnique) {
      verification_code = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      const existingCode =
        await this.usersService.findByVerificationCode(verification_code);
      if (!existingCode) {
        isUnique = true;
      }
    }

    // Mettez à jour l'utilisateur avec le code de vérification
    await this.usersService.update(user._id.toString(), { verification_code });

    // Envoi du code par SMS
    try {
      await this.twilioService.sendVerificationCode(
        phone_number,
        verification_code,
      );
    } catch (error) {
      throw new HttpException(
        'Erreur lors de l’envoi du SMS',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { message: 'Code de vérification envoyé' };
  }

  @Patch('reset-password/:id')
  async resetPassword(
    @Param('id') id: string,
    @Body() { password }: { password: string },
  ) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }

    // Mise à jour du mot de passe sans hachage
    await this.usersService.update(id, { password: password });

    return { message: 'Mot de passe réinitialisé avec succès.' };
  }

  @Delete('logout/:id')
  async logout(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }

    // Incrémente le token_version pour invalider les anciens tokens
    await this.usersService.update(id, {
      token_version: user.token_version + 1,
    });

    return { message: 'Déconnexion réussie' };
  }

  // route pour modifier le user_type
  @UseGuards(JwtAuthGuard)
  @Patch(':id/update-user-type')
  async updateUserType(
    @Param('id') id: string,
    @Body() { user_type }: { user_type: UserType },
  ) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }

    // Verification de la validité du user_type
    if (!Object.values(UserType).includes(user_type)) {
      throw new HttpException(
        'Type d’utilisateur invalide',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Mettre à jour le user_type
    await this.usersService.update(id, { user_type, updated_at: new Date() });

    return { message: 'Type d’utilisateur mis à jour avec succès' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-account')
  async deleteAccount(@Request() req) {
    try {
      const userId = req.user.userId;
      const user = await this.usersService.findOne(userId);

      if (!user) {
        throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
      }

      // Utiliser la nouvelle méthode deleteAccount
      await this.usersService.deleteAccount(userId);

      return { message: 'Compte supprimé avec succès' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Une erreur est survenue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
