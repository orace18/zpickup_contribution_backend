
import { IsEmail, IsNotEmpty, MinLength, Matches, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Length(6, 6)
  code: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre',
  })
  password: string;
}