import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role } from '../../Schemas/roles_schema/Role.schema';
import { Permission } from '../../Schemas/permission_schema/Permission.schema';

interface IPermission extends Document{
  _id: Types.ObjectId;
  key: string;
  name: string;
  description: string;
  group: string;
}

@Injectable()
export class RoleSeeder {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
  ) {}

  async seed(){
    try {
      // Récupérer toutes les permissions existantes
      const permissions = await this.permissionModel
        .find()
        .lean()
        .exec() as unknown as IPermission[];

      const permissionsByKey = new Map<string, Types.ObjectId>(
        permissions.map(p => [p.key, p._id])
      );

      const roles = [
       
        {
          key: 'admin',
          name: 'Administrateur',
          description: 'Gestion des utilisateurs et des courses',
          permissions: [
            'view_users',
            'manage_users',
            'view_user_details',
            'manage_roles',
            'create_course',
            'view_courses',
            'view_gains',
            'view_finances',
            'manage_courses',
            'manage_settings',
            'view_settings',
            'manage_faqs',
            'view_policy',
            'view_configs',
            'view_cgu',
            'view_cartes',
          ]
        },
        {
          key: 'manager',
          name: 'Gestionnaire',
          description: 'Gestion des courses',
          permissions: [
            'view_users',
            'view_user_details',
            'create_course',
            'view_courses',
            'manage_courses'
          ]
        },
        {
          key: 'user',
          name: 'Utilisateur',
          description: 'Accès basique',
          permissions: [
            'view_courses'
          ]
        }
      ];

      const bulkOps = roles.map((role) => ({
        updateOne: {
          filter: { key: role.key },
          update: {
            $set: {
              ...role,
              updated_at: new Date()
            }
          },
          upsert: true,
        },
      }));

      await this.roleModel.bulkWrite(bulkOps);
      console.log('✓ Roles seeding completed');
    } catch (error) {
      console.error('× Error during roles seeding:', error);
      throw error;
    }
  }
}