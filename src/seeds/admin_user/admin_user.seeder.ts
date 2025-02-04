import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UserType } from '../../Schemas/users_schema/Users.schema';
import { Role } from '../../Schemas/roles_schema/Role.schema';

@Injectable()
export class AdminSeeder {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async seed(): Promise<void> {
    try {
      console.log('Début du seeding des admins...');

      const adminRole = await this.roleModel.findOne({ key: 'admin' });

      //const adminSuperRole = await this.roleModel.findOne({ key: 'super_admin' });

      if (!adminRole) {
        throw new Error('Le rôle admin doit être créé avant de seed les utilisateurs admin');
      }



      const defaultAdmins = [
        {
          firstname: 'Super',
          lastname: 'Admin',
          email_address: 'admin@example.com',
          phone_number: '+22900000000',
          password: 'Admin123!',    // Le mot de passe sera hashé par le middleware
          user_type: UserType.ADMIN,
          role: adminRole._id,
        },
        {
          firstname: 'Orace',
          lastname: 'Admin',
          email_address: 'orace@admin.com',
          phone_number: '+22900000001',
          password: 'Admin123!',
          user_type: UserType.ADMIN,
          role: adminRole._id,
        },
        {
          firstname: 'Patrick',
          lastname: 'AMOUSSOU',
          email_address: 'patou@admin.com',
          phone_number: '+22900000002',
          password: 'Admin123!',
          user_type: UserType.ADMIN,
          role: adminRole._id,
        }
      ];

      for (const adminData of defaultAdmins) {
        const existingAdmin = await this.userModel.findOne({
          $or: [
            { email_address: adminData.email_address },
            { phone_number: adminData.phone_number }
          ]
        });

        if (!existingAdmin) {
          console.log('Création d\'un nouvel admin...');
          console.log('Email:', adminData.email_address);

          // Création directe sans hachage manuel - le middleware s'en chargera
          const newAdmin = new this.userModel({
            ...adminData,
            created_at: new Date(),
            updated_at: new Date(),
            validated_at: new Date(),
          });

          // Save déclenchera le middleware pre-save qui hashera le mot de passe
          const savedAdmin = await newAdmin.save();
          console.log(`✓ Admin créé avec succès: ${savedAdmin.email_address}`);
          console.log('ID de l\'admin:', savedAdmin._id);
        } else {
          console.log(`ℹ Admin existe déjà: ${adminData.email_address}`);
        }
      }

      console.log('Seeding des admins terminé avec succès');
    } catch (error) {
      console.error('× Erreur lors du seeding des admins:', error);
      throw error;
    }
  }
}