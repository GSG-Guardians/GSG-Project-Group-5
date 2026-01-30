import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TSignUpRequest } from './dto';
import * as argon from 'argon2';
import { IJWTPayload, TUserForToken } from 'src/types/jwt.types';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(data: TSignUpRequest) {
    const hashedPassword = await this.hashPassword(data.password);
    const user = await this.userService.create({
      ...data,
      password: hashedPassword,
      provider: 'LOCAL',
      providerId: null,
    });

    const userToToken: TUserForToken = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      defaultCurrencyId: user.defaultCurrencyId,
      provider: user.provider,
      status: user.status,
      role: user.role,
    };

    const token = this.generateToken(userToToken);

    return { user, token };
  }

  private hashPassword(password: string) {
    return argon.hash(password);
  }

  private verifyPassword(hash: string, password: string) {
    return argon.verify(hash, password);
  }

  private generateToken(userForToken: TUserForToken) {
    const token = this.jwtService.sign<IJWTPayload>({
      sub: userForToken.id,
      role: userForToken.role,
      email: userForToken.email,
      fullName: userForToken.fullName,
      defaultCurrencyId: userForToken.defaultCurrencyId,
      provider: userForToken.provider,
      status: userForToken.status,
    });
    return token;
  }
}
