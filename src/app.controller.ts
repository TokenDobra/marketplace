import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { MarketService } from './market/market.service';

@Controller()
export class AppController {
  constructor(private readonly marketService: MarketService) {}

  @Get()
  public async getMain(@Res() res: Response): Promise<void> {

    const mainMarketData: any = await this.marketService.getMainPage();
    return res.render(`./views/languages/en/main/main.njk`, { gallery:mainMarketData.gallery,  organizations:mainMarketData.subjects_gallery});
  }
}