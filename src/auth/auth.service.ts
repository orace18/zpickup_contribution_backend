import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Users } from '../Schemas/users_schema/Users.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Users.name) private userModel: Model<Users>,  private jwtService: JwtService, ) {}

  // Service pour l'inscription
  async register(createUserDto: CreateUserDto): Promise<Users> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);  // Hachage du mot de passe
    const createdUser = new this.userModel({ ...createUserDto, password: hashedPassword });
    return createdUser.save();
  }

  // Service pour la connexion
  async login(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
    const user = await this.userModel.findOne({ email: loginUserDto.emailAddress }).exec();

    if (!user || !(await bcrypt.compare(loginUserDto.password, user.password))) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const payload = { email: user.emailAddress, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),  // Génère un token JWT
    };
  }
}
