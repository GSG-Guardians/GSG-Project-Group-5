import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthResponseSwaggerDto,
  SignUpRequestSwaggerDto,
  SignInRequestSwaggerDto,
  type TSignUpRequest,
  type TSignInRequest,
} from './dto';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { SignUpSchema, SignInSchema } from './schemas/auth.schema';
import { ApiBody, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ApiSuccess } from 'src/helpers/swaggerDTOWrapper.helpers';
import type { Response } from 'express';
import { JwtCookieGuard } from './guards/cookies.guard';
import { type Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('sign-up')
  @ApiBody({ type: SignUpRequestSwaggerDto })
  @ApiSuccess(AuthResponseSwaggerDto)
  async signUp(
    @Body(new ZodValidationPipe(SignUpSchema)) data: TSignUpRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signUp(data);

    // Set cookie with the token
    res.cookie('access_token', result.token, {
      httpOnly: true,
      secure: this.configService.getOrThrow('NODE_ENV') === 'production',
      sameSite:
        this.configService.getOrThrow('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return result;
  }

  @Post('sign-in')
  @ApiBody({ type: SignInRequestSwaggerDto })
  @ApiSuccess(AuthResponseSwaggerDto)
  async signIn(
    @Body(new ZodValidationPipe(SignInSchema)) data: TSignInRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signIn(data);

    // Set cookie with the token
    res.cookie('access_token', result.token, {
      httpOnly: true,
      secure: this.configService.getOrThrow('NODE_ENV') === 'production',
      sameSite:
        this.configService.getOrThrow('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return result;
  }

  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth2 flow' })
  @ApiResponse({
    status: 302,
    description: 'Redirects to Google OAuth2 login page',
  })
  googleStart(@Res() res: Response) {
    return res.redirect(this.authService.getGoogleAuthUrl());
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Handle Google OAuth2 callback' })
  @ApiQuery({
    name: 'code',
    required: false,
    description: 'Authorization code returned by Google',
  })
  @ApiQuery({
    name: 'error',
    required: false,
    description: 'Error message returned by Google',
  })
  @ApiResponse({
    status: 302,
    description:
      'Redirects to frontend with access token in cookies or error parameters',
  })
  async googleCallback(
    @Query('code') code: string | undefined,
    @Query('error') googleError: string | undefined,
    @Res() res: Response,
  ) {
    const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
    if (googleError) {
      return res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent(googleError)}`,
      );
    }

    if (!code) {
      return res.redirect(`${frontendUrl}/login?error=missing_code`);
    }

    try {
      const { token } = await this.authService.handleGoogleCallback(code);

      res.cookie('access_token', token, {
        httpOnly: true,
        secure: this.configService.getOrThrow('NODE_ENV') === 'production',
        sameSite:
          this.configService.getOrThrow('NODE_ENV') === 'production'
            ? 'none'
            : 'lax',
        path: '/',
      });

      return res.redirect(`${frontendUrl}`);
    } catch (e: unknown) {
      let errorMessage = 'Unknown error';
      if (e && typeof e === 'object' && 'message' in e) {
        errorMessage = (e as Error).message;
      }

      // Check for Axios/Google error structure
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

  @Get('me')
  @UseGuards(JwtCookieGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiSuccess(AuthResponseSwaggerDto)
  me(@Req() req: Request) {
    return this.authService.me(req.user!);
  }
}
