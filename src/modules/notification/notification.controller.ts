import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import {
  ApiSuccess,
  ApiSuccessPaginated,
} from 'src/helpers/swaggerDTOWrapper.helpers';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import type { IPaginationQuery } from 'src/types/pagination.types';
import type {
  RegisterPushTokenDto,
  RemovePushTokenDto,
} from './dto/request.dto';
import {
  NotificationResponseSwaggerDto,
  PushTokenActionResponseSwaggerDto,
  RegisterPushTokenRequestSwaggerDto,
  RemovePushTokenRequestSwaggerDto,
} from './dto/swagger.dto';
import { NotificationService } from './notification.service';
import {
  RegisterPushTokenSchema,
  RemovePushTokenSchema,
} from './schema/notification.schema';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user notifications with pagination' })
  @ApiSuccessPaginated(NotificationResponseSwaggerDto)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getMyNotifications(
    @Req() req: Request,
    @Query() query: IPaginationQuery,
  ) {
    return await this.notificationService.findMyNotifications(
      req.user!.id,
      query,
    );
  }

  @Post('push-tokens')
  @ApiOperation({ summary: 'Register a push token for the current user' })
  @ApiBody({ type: RegisterPushTokenRequestSwaggerDto })
  @ApiSuccess(PushTokenActionResponseSwaggerDto)
  async registerPushToken(
    @Req() req: Request,
    @Body(new ZodValidationPipe(RegisterPushTokenSchema))
    dto: RegisterPushTokenDto,
  ) {
    await this.notificationService.registerPushToken(req.user!.id, dto);
    return { success: true };
  }

  @Delete('push-tokens')
  @ApiOperation({
    summary: 'Remove (deactivate) a push token for the current user',
  })
  @ApiBody({ type: RemovePushTokenRequestSwaggerDto })
  @ApiSuccess(PushTokenActionResponseSwaggerDto)
  async removePushToken(
    @Req() req: Request,
    @Body(new ZodValidationPipe(RemovePushTokenSchema))
    dto: RemovePushTokenDto,
  ) {
    await this.notificationService.removePushToken(req.user!.id, dto.token);
    return { success: true };
  }
}
