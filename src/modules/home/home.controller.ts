import { Controller, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { ApiSuccess } from '../../helpers/swaggerDTOWrapper.helpers';
import { HomeOverviewResponseSwaggerDto } from './dto/swagger.dto';
import { HomeService } from './home.service';

@ApiTags('Home')
@ApiBearerAuth()
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get home overview' })
  @ApiSuccess(HomeOverviewResponseSwaggerDto)
  getOverview(@Req() req: Request) {
    return this.homeService.getOverview(req.user!);
  }
}
