import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RoleService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Roles } from '../common/decorators/role.decorator';
import { UserType } from '../Schemas/users_schema/Users.schema';

@Controller('role')
export class RoleController {
  constructor(private readonly rolesService: RoleService) {}
  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get()
  @Roles(UserType.ADMIN)
  async getAllRoles() {
    return this.rolesService.findAll();
  }

  @Get()
  @Roles(UserType.ADMIN)
  async getRoleById(role_id) {
    return this.rolesService.findById(role_id)
  }

  @Put(':id')
  @Roles(UserType.ADMIN)
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: Partial<CreateRoleDto>
  ) {
    console.log('Updating role:', id);
    console.log('Update data:', updateRoleDto);
    return this.rolesService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN)
  async deleteRole(@Param('id') id: string) {
    return this.rolesService.deleteRole(id);
  }
}