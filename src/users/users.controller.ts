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
} from '@nestjs/common';
import {UsersService} from './users.service';
import {UpdateUserDto} from './dto/update-user.dto';
import {TwilioService} from '../services/twilio.service';
import {UserType} from '../Schemas/users_schema/Users.schema';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {use} from 'passport';
import {sendMessage, sendNotification} from "../services/helpers.service";

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly twilioService: TwilioService,
    ) {
    }

    @Post('register/phone_number')
    async registerWithPhoneNumber(
        @Body() {phone_number}: { phone_number: string },
    ) {
        // on vérifie si le numéro de téléphone existe déjà
        const existingUser = await this.usersService.findByPhone(phone_number);
        if (existingUser) {
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

        // Envoie du code par SMS
        sendMessage("Votre code de vérification ZPickup : " + verification_code, phone_number);

        // Création d'un utilisateur temporaire avec le minimum d'informations
        const user = await this.usersService.createTemporary({
            phone_number,
            verification_code: verification_code,
            user_type: UserType.CUSTOMER,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return {message: 'Code de vérification envoyé'};
    }

    @Post('verify-phone/send-code')
    async verifyPhoneAndSendCode(@Body() {phone_number}: { phone_number: string }) {
        const user = await this.usersService.findByPhone(phone_number);

        if (!user) {
            throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
        }

        let verification_code: string;
        let isUnique = false;

        while (!isUnique) {
            verification_code = Math.floor(100000 + Math.random() * 900000).toString();
            const existingCode = await this.usersService.findByVerificationCode(verification_code);
            if (!existingCode) {
                isUnique = true;
            }
        }

        await this.usersService.update(user._id.toString(), {verification_code});

        // Envoie du code par SMS
        sendMessage("Votre code de vérification ZPickup : " + verification_code, phone_number);

        return {message: 'Code de vérification envoyé'};
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
        const user = await this.usersService.findByPhone(phone_number);
        if (!user) {
            throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
        }

        if (user.verification_code !== verification_code) {
            throw new HttpException(
                'Code de vérification incorrect',
                HttpStatus.BAD_REQUEST,
            );
        }

        // Mise à jour de `validated_at` et suppression de `verification_code`
        await this.usersService.update(user._id.toString(), {
            validated_at: new Date(),
            verification_code: null,
        });

        return {message: 'Code vérifié avec succès', userId: user._id};
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
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        // Utilisez `await` pour récupérer l'utilisateur avant de vérifier `sponsorship_code`
        const user = await this.usersService.findOne(id);
        if (!user) {
            throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
        }

        // Si le code de parrainage n'existe pas, en génère un
        if (!user.sponsorship_code) {
            const sponsorship_code =
                await this.usersService.generateUniqueSponsorshipCode();
            updateUserDto = {...updateUserDto, sponsorship_code};
        }

        // Mettez à jour l'utilisateur avec les informations reçues dans `updateUserDto`
        return await this.usersService.update(id, {
            ...updateUserDto,
            updated_at: new Date(),
        });
    }

    @Post('forgot-password/send-code')
    async sendVerificationCode(
        @Body() {phone_number}: { phone_number: string },
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
        await this.usersService.update(user._id.toString(), {verification_code});

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

        return {message: 'Code de vérification envoyé'};
    }

    @Patch('reset-password/:id')
    async resetPassword(
        @Param('id') id: string,
        @Body() {password}: { password: string },
    ) {
        const user = await this.usersService.findOne(id);

        if (!user) {
            throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
        }

        // Mise à jour du mot de passe sans hachage
        await this.usersService.update(id, {password: password});

        return {message: 'Mot de passe réinitialisé avec succès.'};
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

        return {message: 'Déconnexion réussie'};
    }

    // route pour modifier le user_type
    @UseGuards(JwtAuthGuard)
    @Patch(':id/update-user-type')
    async updateUserType(@Param('id') id: string, @Body() {user_type}: { user_type: UserType }) {
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
        await this.usersService.update(id, {user_type, updated_at: new Date()})

        return {message: 'Type d’utilisateur mis à jour avec succès'};
    }
}
