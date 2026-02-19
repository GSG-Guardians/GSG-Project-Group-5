import { Reflector } from '@nestjs/core';
import { UserRole } from '../../database/enums';

export const Roles = Reflector.createDecorator<UserRole[]>();
