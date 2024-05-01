// import { SetMetadata } from '@nestjs/common';
// import { UserRoles } from 'src/auth/schemas/user.schema';

// export const Roles = (roles: UserRoles[]) => SetMetadata('roles', roles);

import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<string[]>();