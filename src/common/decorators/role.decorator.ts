import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../Schemas/users_schema/Users.schema';

export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);
