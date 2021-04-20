import { UserRole } from 'src/users/entities/user.entity';
import { SetMetadata } from "@nestjs/common";

export type AllowedRoles = keyof typeof UserRole | 'Any';

export const Role = (role: AllowedRoles[]) => SetMetadata('roles', role);