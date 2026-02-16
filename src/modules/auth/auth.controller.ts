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
  PasswordResetVerifyResponseSwaggerDto,
  PasswordResetRequestResponseSwaggerDto,
  PasswordResetConfirmResponseSwaggerDto,
  type TSignUpRequest,
  type TSignInRequest,
} from './dto';
import { ZodValidationPipe } from '../../pipes/zodValidation.pipe';
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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ApiSuccess } from '../../helpers/swaggerDTOWrapper.helpers';
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
  ) {}

  @Post('sign-up')
  @IsPublic()
  @ApiBody({ type: SignUpRequestSwaggerDto })
  @ApiSuccess(AuthResponseSwaggerDto)
  async signUp(
    @Body(new ZodValidationPipe(SignUpSchema)) data: TSignUpRequest,
  ) {
    const result = await this.authService.signUp(data);

    return result;
  }

  @Post('sign-in')
  @IsPublic()
  @ApiBody({ type: SignInRequestSwaggerDto })
  @ApiSuccess(AuthResponseSwaggerDto)
  async signIn(
    @Body(new ZodValidationPipe(SignInSchema)) data: TSignInRequest,
  ) {
    const result = await this.authService.signIn(data);
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate current token and get new one' })
  @ApiSuccess(AuthResponseSwaggerDto)
  revalidate(@Req() req: Request) {
    const result = this.authService.me(req.user!);
    return result;
  }

  @Get('me')
  @IsPublic()
  @UseGuards(JwtCookieGuard)
  @ApiOperation({ summary: 'Get current user' })
  @ApiSuccess(AuthResponseSwaggerDto)
  me(@Req() req: Request) {
    return this.authService.me(req.user!);
  }

  @Post('password-reset/request')
  @IsPublic()
  @ApiOperation({ summary: 'Request password reset code' })
  @ApiBody({ type: PasswordResetRequestSwaggerDto })
  @ApiSuccess(PasswordResetRequestResponseSwaggerDto)
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
  ) {
    return this.passwordResetService.verifyResetCode(dto.email, dto.code);
  }

  @Patch('password-reset/confirm')
  @ApiOperation({ summary: 'Set new password using reset token' })
  @ApiBody({ type: PasswordResetConfirmSwaggerDto })
  @ApiSuccess(PasswordResetConfirmResponseSwaggerDto)
  @ApiBearerAuth()
  confirmReset(
    @Body(new ZodValidationPipe(PasswordResetConfirmSchema))
    dto: PasswordResetConfirmDto,
    @Req() req: Request,
  ) {
    return this.passwordResetService.confirmReset(
      req.user!.id,
      dto.newPassword,
    );
  }
}
