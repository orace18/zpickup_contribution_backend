import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { VerificationCode } from 'src/Schemas/verification_code_schema/verification-code.schema';
import { MailService } from 'src/mail/mail.service';
import { AdminService } from 'src/users/admin/admin.service';

@Injectable()
export class ResetPasswordService {

  constructor(
    @InjectModel(VerificationCode.name) private verificationCodeModel: Model<VerificationCode>,
    private mailService: MailService,
    private userService: AdminService,
  ) { }

  /**
   * Génère un code de vérification à 6 chiffres
   */
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Envoie un code de vérification par email
   */
  async sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Vérifier si l'utilisateur existe
      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        throw new NotFoundException('Aucun utilisateur trouvé avec cet email');
      }

      // Générer un nouveau code
      const code = this.generateVerificationCode();

      // Supprimer tout code existant pour cet email
      await this.verificationCodeModel.deleteMany({ email });

      // Créer un nouveau code dans la base de données
      await this.verificationCodeModel.create({
        email,
        code,
        used: false,
      });

      // Envoyer l'email avec le code
      await this.mailService.sendVerificationCode(email, code);

      return {
        success: true,
        message: 'Code de vérification envoyé avec succès',
      };
    } catch (error) {
      console.log("L'erreur:",error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de l\'envoi du code de vérification');
    }
  }

  /**
   * Vérifie si le code est valide pour l'email donné
   */
  async verifyCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
    try {
      // Trouver le code de vérification pour l'email spécifié
      console.log(`Tentative de vérification pour: Email=${email}, Code=${code}`);
      const verificationCode = await this.verificationCodeModel.findOne({
        email,
        code,
        used: false,
      });

      console.log('Code récupéré:', verificationCode);
      if (!verificationCode) {
        throw new BadRequestException('Code de vérification invalide ou expiré');
      }

      return {
        success: true,
        message: 'Code de vérification valide',
      };
    } catch (error) {
      console.log("L'erreur:",error);
      throw new BadRequestException('Erreur lors de la vérification du code');
    }
  }

  /**
   * Réinitialise le mot de passe de l'utilisateur après avoir vérifié le code
   */
  /* async resetPassword(email: string, code: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      // Vérifier le code
      const verificationResult = await this.verifyCode(email, code);

      if (!verificationResult.success) {
        throw new BadRequestException('Code de vérification invalide');
      }

      // Mettre à jour le mot de passe de l'utilisateur
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userService.updatePassword(email, hashedPassword);

      // Marquer le code comme utilisé
      await this.verificationCodeModel.updateOne(
        { email, code },
        { used: true }
      );

      return {
        success: true,
        message: 'Mot de passe réinitialisé avec succès',
      };
    } catch (error) {
      console.log("L'erreur:",error);
      throw new BadRequestException('Erreur lors de la réinitialisation du mot de passe');
    }
  } */

    async resetPassword(email: string, code: string, newPassword: string): Promise<{ success: boolean; message: string }> {
      try {
        console.log(`Tentative de réinitialisation: Email=${email}, Code=${code}, Password=***`);
        
        // Vérifier directement si le code existe dans la base de données sans appeler verifyCode()
        const verificationCode = await this.verificationCodeModel.findOne({
          email,
          code,
          used: false,
        });
    
        if (!verificationCode) {
          throw new BadRequestException('Code de vérification invalide ou expiré');
        }
    
        // Mettre à jour le mot de passe de l'utilisateur
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userService.updatePassword(email, hashedPassword);
    
        // Marquer le code comme utilisé
        await this.verificationCodeModel.updateOne(
          { email, code },
          { used: true }
        );
    
        return {
          success: true,
          message:  'Mot de passe réinitialisé avec succès',
        };
      } catch (error) {
        console.log("L'erreur:", error);
        throw new BadRequestException('Erreur lors de la réinitialisation du mot de passe');
      }
    }
}
