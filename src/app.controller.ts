import { Controller, Get, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { MarketService } from './market/market.service';

@Controller()
export class AppController {
  constructor(private readonly marketService: MarketService) {}

  @Get()
  public async getMain(@Res() res: Response): Promise<void> {

    const mainMarketData: any = await this.marketService.getMainPage();
    return res.render(`./views/languages/en/main/main.njk`, { gallery:mainMarketData.gallery,  organizations:mainMarketData.subjects_gallery});
  }
  @Get(`artwork`)
  public async getNFTPage(@Req() request: Request, @Res() res: Response): Promise<void> {
    const {uuid} = request.query;
    const artworkMarketData: any = await this.marketService.getArtworkPage(uuid);
    return res.render(`./views/languages/en/artwork/main.njk`, { artwork:artworkMarketData.offer,  organizations:artworkMarketData.subjects_gallery});
  }
}