import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from '../../Schemas/permission_schema/Permission.schema';

@Injectable()
export class PermissionSeeder {
  constructor(
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
  ) {}

  async seed() {
    try {
      const permissions = [
        // Permissions Utilisateurs
        {
          key: 'view_users',
          name: 'Voir les utilisateurs',
          description: 'Permet de voir la liste des utilisateurs',
          group: 'Users'
        },
        {
          key: 'manage_users',
          name: 'Gérer les utilisateurs',
          description: 'Permet de créer, modifier et supprimer des utilisateurs',
          group: 'Users'
        },
        {
          key: 'view_user_details',
          name: 'Voir les détails utilisateur',
          description: 'Permet de voir les informations détaillées des utilisateurs',
          group: 'Users'
        },

        // Permissions Rôles
        {
          key: 'view_roles',
          name: 'Voir les rôles',
          description: 'Permet de voir la liste des rôles',
          group: 'Roles'
        },
        {
          key: 'view_gains',
          name: 'Voir les gains',
          description: 'Permet de voir la liste des gains',
          group: 'Finances'
        },
        {
          key: 'view_finances',
          name: 'Voir les finances',
          description: 'Permet de voir la liste des finances',
          group: 'Roles'
        },
        {
          key: 'manage_roles',
          name: 'Gérer les rôles',
          description: 'Permet de créer, modifier et supprimer des rôles',
          group: 'Roles'
        },

        // Permissions Courses
        {
          key: 'create_course',
          name: 'Créer une course',
          description: 'Permet de créer une nouvelle course',
          group: 'Courses'
        },
        {
          key: 'view_courses',
          name: 'Voir les courses',
          description: 'Permet de voir la liste des courses',
          group: 'Courses'
        },
        {
          key: 'manage_courses',
          name: 'Gérer les courses',
          description: 'Permet de modifier et supprimer des courses',
          group: 'Courses'
        },

        // Permissions Configuration
        {
          key: 'manage_settings',
          name: 'Gérer les paramètres',
          description: 'Permet de modifier les paramètres du système',
          group: 'Settings'
        },
        {
          key: 'view_settings',
          name: 'Voir les paramètres',
          description: 'Permet de voir les paramètres du système',
          group: 'Settings'
        },

        
        {
          key: 'view_cgu',
          name: 'Voir les CGU',
          description: 'Permet de voir les condition générales d\'utilisatieon',
          group: 'Settings'
        },
        
        {
          key: 'view_policy',
          name: 'Voir les politique d\'utilisation',
          description: 'Permet de voir les politique d\'utilisation',
          group: 'Settings'
        },
        
        {
          key: 'view_configs',
          name: 'Voir les configurations',
          description: 'Permet de voir les configurations',
          group: 'Settings'
        },

        {
          key: 'view_cartes',
          name: 'Voir la carte',
          description: 'Permet de voir la carte',
          group: 'Cartes'
        },
      ];

      const bulkOps = permissions.map((permission) => ({
        updateOne: {
          filter: { key: permission.key },
          update: {
            $set: {
              ...permission,
              updated_at: new Date()
            }
          },
          upsert: true,
        },
      }));

      await this.permissionModel.bulkWrite(bulkOps);
      console.log('✓ Permissions seeding completed');
    } catch (error) {
      console.error('× Error during permissions seeding:', error);
      throw error;
    }
  }
}