import { Controller, Get, Post, Res, Req, Param, Body } from '@nestjs/common';
import { Response, Request } from 'express';
import { MarketService } from './market/market.service';
import { OperationService, SourceItemDto,  CreateOrderDto} from './operation/operation.service';
import {StripeService} from './stripe/stripe.service';
import {CertificateService} from './certificate/certificate.service';



export class OrderDto {
  offer:string; 
  source:string; 
  quantity:number; 
  price:number;
}
export class OrderArtworkDto {
  source:string; 
  quantity:number; 
  price:number; 
  artwork: string;
  fullname:string; 
  phone:string; 
  email:string;
}


@Controller()
export class AppController {
  constructor(private readonly marketService: MarketService, 
              private readonly operationService: OperationService,
              private readonly stripeService: StripeService,
              private readonly certificateService: CertificateService,

             ) {}

  @Get()
  public async getMain(@Res() res: Response): Promise<void> {

    const mainMarketData: any = await this.marketService.getMainPage();
    return res.render(`./views/languages/en/main/main.njk`, { gallery:mainMarketData.gallery,  organizations:mainMarketData.subjects_gallery});
  }
  @Get('certificate')
  public async getCertificate(@Req() request: Request, @Res() res: Response): Promise<void> {
    const {uuid} = request.query;
    const certificateData: any = await this.certificateService.getPaid(uuid);
    return res.render(`./views/languages/en/certificate/main.njk`, { paid: uuid, holder:certificateData.holder,  certificates:certificateData.certificates});
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
  @Post(`order`)
  public async getOrder(@Body() data: OrderDto, @Res() res: Response): Promise<void> {
    let {offer, source, quantity, price} = data;
    const artworkMarketData: any = await this.marketService.getArtworkPage(offer);
    let position:any = artworkMarketData.offer.token;
    let typeArtwork:string = "Pre-NFT";
    price = artworkMarketData.offer.token.price;
    let sum:number = Number(artworkMarketData.offer.token.price) * quantity;
    if(artworkMarketData.offer.original.source == source)
    {
      position = artworkMarketData.offer.original;
      price = artworkMarketData.offer.original.price;
      sum = Number(artworkMarketData.offer.original.price) * quantity;
      typeArtwork = "Original";
    }

    return res.render(`./views/languages/en/order/main.njk`, { artwork:artworkMarketData.offer,  position:position, typeArtwork, price, quantity, sum});

  }

  @Get('success')
  public async successPay(@Req() request: Request, @Res() res: Response): Promise<void> {
    const {session_id} = request.query;
    const session = await this.stripeService.retrieve(session_id);
    const order_uuid = session.metadata.order_uuid;
    const paid = await this.operationService.createPaid(order_uuid);
    const certificateData: any = await this.certificateService.getPaid(paid.uuid);
    return res.render(`./views/languages/en/certificate/main.njk`, { paid: paid.uuid, holder:certificateData.holder,  certificates:certificateData.certificates});

//    console.log('successPay', paid);
//    return res.render(`./views/languages/en/successfully/main.njk`, {});
  }

  @Get('cancel')
  public async cancelPay(@Req() request: Request, @Res() res: Response): Promise<void> {
//     console.log('cancelPay', data);
    const {session_id} = request.query;
    const session = await this.stripeService.retrieve(session_id);
    const order_uuid = session.metadata.order_uuid;
    console.log('cancelPay', order_uuid);
    return res.redirect('/');

//     return res.render(`./views/languages/en/successfully/main.njk`, {});

  }

 
  @Post(`order_artwork`)
  public async createOrderAndPay(@Body() data: OrderArtworkDto, @Res() res: Response): Promise<void> {
     const orderItem: SourceItemDto = { uuid: data.source,
                                        quantity: data.quantity,
                                        price: data.price
                                      };
     const orderData: CreateOrderDto = { sources: [orderItem],
                                         fullname: data.fullname, 
                                         phone: data.phone,
                                         email: data.email
                                       };

     const order:any = await this.operationService.createOrder(orderData);

     const item = {
        price_data: {
           currency: 'usd',
           product_data: {
              name: data.artwork
           },
           unit_amount: data.price * 100, // Цена в центах

        },
        quantity: data.quantity,
     };
     const session = await this.stripeService.checkout([item], order.uuid, `success`, `cancel`);
     return res.redirect(303, session.url);
//    console.log(order);

//    const paid = await this.operationService.createPaid(order.uuid);
//    console.log('successPay', paid);
                                                                         
//    return res.render(`./views/languages/en/successfully/main.njk`, {});

/*
    const artworkMarketData: any = await this.marketService.getArtworkPage(offer);
    let position:any = artworkMarketData.offer.token;
    let typeArtwork:string = "Pre-NFT";
    price = artworkMarketData.offer.token.price;
    let sum:number = Number(artworkMarketData.offer.token.price) * quantity;
    if(artworkMarketData.offer.original.source == source)
    {
      position = artworkMarketData.offer.original;
      price = artworkMarketData.offer.original.price;
      sum = Number(artworkMarketData.offer.original.price) * quantity;
      typeArtwork = "Original";
    }

    return res.render(`./views/languages/en/order/main.njk`, { artwork:artworkMarketData.offer,  position:position, typeArtwork, price, quantity, sum});
*/
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