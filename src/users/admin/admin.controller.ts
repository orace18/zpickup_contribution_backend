import { Controller, Get, Param, Patch, Delete, Body, UseGuards, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserType } from '../../Schemas/users_schema/Users.schema';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PermissionsGuard } from '../../common/guards/permission.guard';
import { UsersService } from '../users.service';
//import { RequirePermissions } from '../../common/decorators/permission.decorator';
import { Role } from '../../Schemas/roles_schema/Role.schema';
import { RoleService } from '../../roles/roles.service';

@Controller('admin')
//@UseGuards(RolesGuard, PermissionsGuard)
@Roles(UserType.ADMIN)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersService: UsersService,
    private readonly roleService: RoleService,

  ) {}

  @Post('create-admin')
  async createAdmin(@Body() createUserDto: CreateUserDto) {
    const { phone_number, email_address, role } = createUserDto;

    const existingUser = await this.usersService.findByMail(email_address);
    if (existingUser) {
      throw new HttpException('Ce mail est déjà utilisé.', HttpStatus.BAD_REQUEST);
    }

    // Vérification du rôle si fourni
    if (role) {
      const existingRole = await this.roleService.findById(role.toString());
      if (!existingRole) {
        throw new HttpException('Le rôle spécifié n\'existe pas.', HttpStatus.BAD_REQUEST);
      }
    }

    const newAdmin = await this.adminService.createAdmin({
      ...createUserDto,
      role: role, // Passez le rôle explicitement
      user_type: UserType.ADMIN,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return { message: 'Administrateur créé avec succès.', user: newAdmin };
  }

  @Get('users')
  //@RequirePermissions('view_users')
  async findAllAdmins() {
    return this.adminService.findAllAdmins();
  }

  @Get('users/:id')
 // @RequirePermissions('view_users')
  async findUserById(@Param('id') id: string) {
    const user = await this.adminService.findUserById(id);
    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Patch('users/:id')
  //@RequirePermissions('manage_users')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.adminService.updateUser(id, updateUserDto);
    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Delete('users/:id')
  //@RequirePermissions('manage_users')
  async deleteUser(@Param('id') id: string) {
    const user = await this.adminService.deleteUser(id);
    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }
    return { message: 'Utilisateur supprimé avec succès' };
  }
}