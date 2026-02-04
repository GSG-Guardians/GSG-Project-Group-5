import { Controller, Get } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApiSuccessArray } from '../../helpers/swaggerDTOWrapper.helpers';
import { CurrencyResponseSwaggerDto } from './dto/swagger.dto';

@ApiTags('Currencies')
@ApiBearerAuth()
@Controller('currencies')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  @ApiOperation({ summary: 'List all currencies' })
  @ApiSuccessArray(CurrencyResponseSwaggerDto)
  async findAll() {
    return this.currencyService.findAll();
  }
}
