import { Controller, Get, Query, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { ApiSuccessPaginated } from '../../helpers/swaggerDTOWrapper.helpers';
import type { IPaginationQuery } from '../../types/pagination.types';
import { ReminderResponseSwaggerDto } from './dto/swagger.dto';
import { ReminderService } from './reminder.service';

@ApiTags('Reminders')
@ApiBearerAuth()
@Controller('reminders')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user reminders with pagination' })
  @ApiSuccessPaginated(ReminderResponseSwaggerDto)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getMyReminders(@Req() req: Request, @Query() query: IPaginationQuery) {
    return this.reminderService.findMyReminders(req.user!.id, query);
  }
}
