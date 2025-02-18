import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../Schemas/users_schema/Users.schema';

export const RequiredRoles = (...roles: UserType[]) => SetMetadata('roles', roles);
