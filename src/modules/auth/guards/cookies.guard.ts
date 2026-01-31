import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { IJWTPayload } from 'src/types/jwt.types';
import { UserService } from 'src/modules/user/user.service';
import { toUserResponse } from 'src/modules/user/mappers/user.mapper';
import type { Request } from 'express';

@Injectable()
export class JwtCookieGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const token = (req.cookies as Record<string, string>)?.access_token;
    if (!token) throw new UnauthorizedException('Missing access token');

    try {
      const payload = this.jwtService.verify<IJWTPayload>(token);
      const user = await this.userService.findByEmail(payload.email);
      if (!user) throw new UnauthorizedException('User not found');
      const userToClient = toUserResponse(user);
      req.user = userToClient;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
