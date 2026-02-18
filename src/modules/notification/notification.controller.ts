import { Body, Controller, Delete, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { ApiSuccess } from 'src/helpers/swaggerDTOWrapper.helpers';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import type {
  RegisterPushTokenDto,
  RemovePushTokenDto,
} from './dto/request.dto';
import {
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
