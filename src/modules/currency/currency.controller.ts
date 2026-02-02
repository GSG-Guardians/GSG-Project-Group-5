import { Controller, Get } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('currencies')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  async findAll() {
    return this.currencyService.findAll();
  }
}
