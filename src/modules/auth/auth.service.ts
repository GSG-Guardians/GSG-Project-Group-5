import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TSignInRequest, TSignUpRequest } from './dto';
import * as argon from 'argon2';
import { IJWTPayload, TUserForToken } from 'src/types/jwt.types';

import { JwtService } from '@nestjs/jwt';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GoogleIdTokenPayload, GoogleTokenResponse } from './types/googletypes';
import { UserResponseDto } from '../user/dto';
import { User } from 'database/entities/user.entities';
import { Response } from 'express';
import { toUserResponse } from '../user/mappers/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(data: TSignUpRequest) {
    const hashedPassword = await this.hashPassword(data.password);
    const user = await this.userService.create({
      ...data,
      password: hashedPassword,
      provider: 'LOCAL',
      providerId: null,
    });

    const userToToken = this.mapUserToToken(user);

    const token = this.generateToken(userToToken);

    return { user, token };
  }

  async signIn(data: TSignInRequest) {
    const user = await this.userService.findByEmail(data.email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!user.passwordHash)
      throw new UnauthorizedException(
        'Invalid credentials - User has no password (maybe social login?)',
      );

    const isPasswordValid = await this.verifyPassword(
      user.passwordHash,
      data.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const userToToken = this.mapUserToToken(user);

    const token = this.generateToken(userToToken);
    const userToResponse = toUserResponse(user);
    return { user: userToResponse, token };
  }

  private hashPassword(password: string) {
    return argon.hash(password);
  }

  private jwks = createRemoteJWKSet(
    new URL('https://www.googleapis.com/oauth2/v3/certs'),
  );

  private verifyPassword(hash: string, password: string) {
    return argon.verify(hash, password);
  }

  getGoogleAuthUrl() {
    const params = new URLSearchParams({
      client_id: this.configService.getOrThrow('GOOGLE_CLIENT_ID'),
      redirect_uri: this.configService.getOrThrow('GOOGLE_CALLBACK_URL'),
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async handleGoogleCallback(code: string): Promise<{ token: string }> {
    const tokens = await this.exchangeCodeForTokens(code);
    const googlePayload = await this.verifyIdToken(tokens.id_token);
    const fullName = `${googlePayload.given_name} ${googlePayload.family_name}`;

    let user: UserResponseDto | User | null;
    user = await this.userService.findByEmail(googlePayload.email!);
    if (!user) {
      user = await this.userService.create({
        email: googlePayload.email!,
        fullName,
        provider: 'GOOGLE',
        providerId: googlePayload.sub,
      });
    }

    const userToToken = this.mapUserToToken(user);
    const token = this.generateToken(userToToken);
    return { token };
  }

  async processGoogleCallback(res: Response, code?: string, error?: string) {
    const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');

    if (error) {
      return res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent(error)}`,
      );
    }

    if (!code) {
      return res.redirect(`${frontendUrl}/login?error=missing_code`);
    }

    try {
      const { token } = await this.handleGoogleCallback(code);

      res.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      });

      return res.redirect(`${frontendUrl}`);
    } catch (e: unknown) {
      let errorMessage = 'Unknown error';
      if (e && typeof e === 'object' && 'message' in e) {
        errorMessage = (e as Error).message;
      }

      if (e && typeof e === 'object' && 'response' in e) {
        const errorObj = e as {
          response?: { data?: { error_description?: string } };
        };
        if (errorObj.response?.data?.error_description) {
          errorMessage = errorObj.response.data.error_description;
        }
      }

      return res.redirect(
        `${frontendUrl}/login?error=google_auth_failed&details=${encodeURIComponent(errorMessage)}`,
      );
    }
  }

  me(user: UserResponseDto) {
    const userForToken = this.mapUserToToken(user);
    const token = this.generateToken(userForToken);
    return { user, token };
  }

  private mapUserToToken(user: User | UserResponseDto): TUserForToken {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      provider: user.provider,
      status: user.status,
      role: user.role,
    };
  }

  private async exchangeCodeForTokens(code: string) {
    const data = new URLSearchParams({
      code,
      client_id: this.configService.getOrThrow('GOOGLE_CLIENT_ID'),
      client_secret: this.configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      redirect_uri: this.configService.getOrThrow('GOOGLE_CALLBACK_URL'),
      grant_type: 'authorization_code',
    });

    const res = await axios.post<GoogleTokenResponse>(
      'https://oauth2.googleapis.com/token',
      data.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    return res.data;
  }

  private async verifyIdToken(idToken: string) {
    const { payload } = await jwtVerify(idToken, this.jwks, {
      issuer: ['https://accounts.google.com', 'accounts.google.com'],
      audience: this.configService.getOrThrow('GOOGLE_CLIENT_ID'),
    });
    return payload as GoogleIdTokenPayload;
  }

  private generateToken(userForToken: TUserForToken) {
    const token = this.jwtService.sign<IJWTPayload>({
      sub: userForToken.id,
      role: userForToken.role,
      email: userForToken.email,
      fullName: userForToken.fullName,
      provider: userForToken.provider,
      status: userForToken.status,
    });
    return token;
  }
}
