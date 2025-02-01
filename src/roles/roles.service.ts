import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from '../Schemas/roles_schema/Role.schema';
import { Permission } from '../Schemas/permission_schema/Permission.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { Users } from '../Schemas/users_schema/Users.schema';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(Permission.name) private readonly permissionModel: Model<Permission>,
    @InjectModel(Users.name) private readonly userModel: Model<Users>
  ) {

  }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const existingRole = await this.roleModel.findOne({ name: createRoleDto.name });
      if (existingRole) {
        throw new BadRequestException(`Le rôle "${createRoleDto.name}" existe déjà`);
      }
      const role = new this.roleModel(createRoleDto);
      return role.save();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException("Erreur lors de la création du rôle");
    }
  }


  async findAll() {
    return this.roleModel.find().populate('permissions').exec();
  }

  async findById(id: string) {
    return this.roleModel.findById(id).populate('permissions').exec();
  }

  async updateRole(id: string, updateRoleDto: Partial<CreateRoleDto>): Promise<Role> {
    try {
      // Convertir les clés de permission en IDs
      if (updateRoleDto.permissions) {
        const permissions = await this.permissionModel.find({
          key: { $in: updateRoleDto.permissions }
        });

        if (permissions.length !== updateRoleDto.permissions.length) {
          throw new BadRequestException("Certaines permissions n'existent pas");
        }

        // Remplacer les clés par les IDs
        updateRoleDto.permissions = permissions.map(p => p._id.toString());
      }

      const role = await this.roleModel.findByIdAndUpdate(
        id,
        updateRoleDto,
        { new: true }
      ).populate('permissions');

      if (!role) {
        throw new BadRequestException("Rôle non trouvé");
      }
      return role;
    } catch (error) {
      console.error('Update role error:', error);
      throw new BadRequestException(
        error instanceof BadRequestException
          ? error.message
          : "Erreur lors de la modification du rôle"
      );
    }
  }

  async deleteRole(id: string): Promise<void> {
    try {
      // Convertir l'ID en ObjectId
      const roleId = new Types.ObjectId(id);

      // Vérifier si le rôle existe
      const role = await this.roleModel.findById(roleId);
      if (!role) {
        this.logger.debug(`Rôle non trouvé avec l'ID: ${id}`);
        throw new BadRequestException("Rôle non trouvé");
      }

      // Rechercher les utilisateurs avec ce rôle
      const usersWithRole = await this.userModel.find({ role: roleId });
      this.logger.debug(`Recherche d'utilisateurs avec le rôle ${id}`);
      this.logger.debug(`Nombre d'utilisateurs trouvés: ${usersWithRole.length}`);

      // Si des utilisateurs ont ce rôle, empêcher la suppression
      if (usersWithRole.length > 0) {
        const userIds = usersWithRole.map(user => user._id).join(', ');
        this.logger.debug(`Utilisateurs trouvés avec ce rôle: ${userIds}`);
        throw new BadRequestException(
          `Impossible de supprimer ce rôle car il est actuellement attribué à ${usersWithRole.length} utilisateur(s). `
        );
      }

      // Procéder à la suppression si aucun utilisateur n'a ce rôle
      const result = await this.roleModel.findByIdAndDelete(roleId);
      if (!result) {
        throw new BadRequestException("Erreur lors de la suppression du rôle");
      }

      this.logger.debug(`Rôle  supprimé avec succès`);
    } catch (error) {
      this.logger.error('Erreur lors de la suppression du rôle:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        error.message || "Erreur lors de la suppression du rôle"
      );
    }
  }
}