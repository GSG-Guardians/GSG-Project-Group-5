import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  Query,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthResponseSwaggerDto,
  SignUpRequestSwaggerDto,
  SignInRequestSwaggerDto,
  PasswordResetRequestSwaggerDto,
  PasswordResetVerifySwaggerDto,
  PasswordResetConfirmSwaggerDto,
  PasswordResetGenericResponseSwaggerDto,
  PasswordResetVerifyResponseSwaggerDto,
  type TSignUpRequest,
  type TSignInRequest,
} from './dto';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { SignUpSchema, SignInSchema } from './schemas/auth.schema';
import {
  PasswordResetConfirmSchema,
  PasswordResetRequestSchema,
  PasswordResetVerifySchema,
} from './schemas/password-reset.schema';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiSuccess } from 'src/helpers/swaggerDTOWrapper.helpers';
import type { Response } from 'express';
import { JwtCookieGuard } from './guards/cookies.guard';
import { type Request } from 'express';
import { ConfigService } from '@nestjs/config';
import type {
  PasswordResetConfirmDto,
  PasswordResetRequestDto,
  PasswordResetVerifyDto,
} from './dto/password-reset.dto';
import { PasswordResetService } from './password-reset.service';
import { IsPublic } from '../../decorators/isPublic.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly passwordResetService: PasswordResetService,
  ) { }

  @Post('sign-up')
  @IsPublic()
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
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result;
  }

  @Post('sign-in')
  @IsPublic()
  @ApiBody({ type: SignInRequestSwaggerDto })
  @ApiSuccess(AuthResponseSwaggerDto)
  async signIn(
    @Body(new ZodValidationPipe(SignInSchema)) data: TSignInRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signIn(data);

    res.cookie('access_token', result.token, {
      httpOnly: true,
      secure: this.configService.getOrThrow('NODE_ENV') === 'production',
      sameSite:
        this.configService.getOrThrow('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result;
  }

  @Get('google')
  @IsPublic()
  @ApiOperation({ summary: 'Initiate Google OAuth2 flow' })
  @ApiResponse({
    status: 302,
    description: 'Redirects to Google OAuth2 login page',
  })
  googleStart(@Res() res: Response) {
    return res.redirect(this.authService.getGoogleAuthUrl());
  }

  @Get('google/callback')
  @IsPublic()
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
    return this.authService.processGoogleCallback(res, code, googleError);
  }

  @Get('revalidate')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiSuccess(AuthResponseSwaggerDto)
  revalidate(
    @Req() req: Request,
  ) {
    return this.authService.revalidate(req.user!);
  }

  @Post('password-reset/request')
  @IsPublic()
  @ApiOperation({ summary: 'Request password reset code' })
  @ApiBody({ type: PasswordResetRequestSwaggerDto })
  @ApiSuccess(PasswordResetGenericResponseSwaggerDto)
  requestReset(
    @Body(new ZodValidationPipe(PasswordResetRequestSchema))
    dto: PasswordResetRequestDto,
  ) {
    return this.passwordResetService.requestReset(dto.email);
  }

  @Post('password-reset/verify')
  @IsPublic()
  @ApiOperation({ summary: 'Verify reset code and get reset token' })
  @ApiBody({ type: PasswordResetVerifySwaggerDto })
  @ApiSuccess(PasswordResetVerifyResponseSwaggerDto)
  verifyReset(
    @Body(new ZodValidationPipe(PasswordResetVerifySchema))
    dto: PasswordResetVerifyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.passwordResetService.verifyResetCode(dto.email, dto.code, res);
  }

  @Patch('password-reset/confirm')
  @IsPublic()
  @ApiOperation({ summary: 'Set new password using reset token' })
  @ApiBody({ type: PasswordResetConfirmSwaggerDto })
  @ApiSuccess(PasswordResetGenericResponseSwaggerDto)
  @UseGuards(JwtCookieGuard)
  confirmReset(
    @Body(new ZodValidationPipe(PasswordResetConfirmSchema))
    dto: PasswordResetConfirmDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.passwordResetService.confirmReset(
      req.user!.id,
      dto.newPassword,
      res
    );
  }
}
