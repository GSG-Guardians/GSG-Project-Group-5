import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { LogInDto } from './dto/request/login.request.dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Token } from './dto/response/token.response.dto';
import { InstitutionLogInDto } from './dto/request/institution-login.request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LogInDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged in successfuly',
    type: Token,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'UNAUTHORIZED' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to store refresh token',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body(new ValidationPipe()) loginDto: LogInDto,
  ): Promise<Token | undefined> {
    return await this.authService.login(loginDto);
  }
}
