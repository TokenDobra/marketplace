import { Controller, Get, Res, Req, Param } from '@nestjs/common';
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
  @Get(`termsofservivce`)
  public async getTerms(@Res() res: Response): Promise<void> {

    return res.render(`./views/languages/en/termsofservivce/main.njk`);
  }
  @Get(`privacy`)
  public async getPrivacy(@Res() res: Response): Promise<void> {

    return res.render(`./views/languages/en/privacy/main.njk`);
  }
  @Get(`about`)
  public async getAbout(@Res() res: Response): Promise<void> {

    return res.render(`./views/languages/en/about/main.njk`);
  }
  @Get(`order`)
  public async getOrder(@Req() request: Request, @Res() res: Response): Promise<void> {
    const {offer, offer_pos} = request.query;
    const artworkMarketData: any = await this.marketService.getArtworkPage(offer);
    let position = artworkMarketData.offer.token;
    let typeArtwork = "pre-NFT";
    if(artworkMarketData.offer.original.source == offer_pos)
    {
      position = artworkMarketData.offer.original;
      typeArtwork = "original";
    }
    return res.render(`./views/languages/en/order/main.njk`, { artwork:artworkMarketData.offer,  position:position, typeArtwork});

  }



  @Get(`artwork`)
  public async getNFTPage(@Req() request: Request, @Res() res: Response): Promise<void> {
    const {uuid} = request.query;
    const artworkMarketData: any = await this.marketService.getArtworkPage(uuid);
    return res.render(`./views/languages/en/artwork/main.njk`, { artwork:artworkMarketData.offer,  organizations:artworkMarketData.subjects_gallery});
  }

  private getUUIDByName(name:string): string {
     if(name == `autismchallenge`)
        return `0ca4034f-b74a-4644-b3f0-193dbd712d69`;
     if(name == `otkrytofond`)
        return `3e32ac13-742c-4860-9653-232e112bc883`;
     if(name == `dobriymir`)
        return `a6b7b385-358f-4604-8d9a-97ab6a1c9399`;
      return;
  }

  @Get(`:organization`)
  public async getOrganization(@Param(`organization`) organization: string, @Res() res: Response): Promise<void> {



    const uuidOrganization = this.getUUIDByName(organization);
    if(uuidOrganization == undefined)
    {
       const mainMarketData: any = await this.marketService.getMainPage();
       return res.render(`./views/languages/en/main/main.njk`, { gallery:mainMarketData.gallery,  organizations:mainMarketData.subjects_gallery});
    }

    const organizationMarketData: any = await this.marketService.getOrganizationPage(uuidOrganization);

    return res.render(`./views/languages/en/organization/main.njk`, { organization:organizationMarketData.subject_gallery});
  }

}