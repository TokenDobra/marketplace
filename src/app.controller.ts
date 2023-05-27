import { Controller, Get, Post, Res, Req, Param, Body } from '@nestjs/common';
import { Response, Request } from 'express';
import { MarketService } from './market/market.service';
import { OperationService, SourceItemDto,  CreateOrderDto} from './operation/operation.service';
import {StripeService} from './stripe/stripe.service';
import {CertificateService} from './certificate/certificate.service';
import {TinkoffService} from './tinkoff/tinkoff.service';



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

class HostSetting
{
  marketplace: string;
  language: string;
  constructor(marketplace: string, language: string)
  {
     this.marketplace = marketplace;
     this.language = language;
  }
}
@Controller()
export class AppController {
  constructor(private readonly marketService: MarketService, 
              private readonly operationService: OperationService,
              private readonly stripeService: StripeService,
              private readonly certificateService: CertificateService,
              private readonly tinkoffService: TinkoffService,
             ) {
             }
  getSetting(host: string): HostSetting
  {
     if(host == `joincharible.com`)
       return new HostSetting(`joincharible`, `en`);
     return new HostSetting(`tokendobra`, `ru`);
  }

  @Get()
  public async getMain(@Req() request: Request, @Res() res: Response): Promise<void> {
     const setting:HostSetting = this.getSetting(request.get('Host'));

    const mainMarketData: any = await this.marketService.getMainPage(setting.marketplace);
    return res.render(`./views/languages/${setting.language}/main/main.njk`, { gallery:mainMarketData.gallery,  organizations:mainMarketData.subjects_gallery});
  }
  @Get('certificate')
  public async getCertificate(@Req() request: Request, @Res() res: Response): Promise<void> {
    const setting:HostSetting = this.getSetting(request.get('Host'));
    const {uuid} = request.query;
    const certificateData: any = await this.certificateService.getPaid(setting.marketplace, uuid);
    return res.render(`./views/languages/${setting.language}/certificate/main.njk`, { paid: uuid, holder:certificateData.holder,  certificates:certificateData.certificates});
  }


  @Get(`faq`)
  public async getFaq(@Req() request: Request, @Res() res: Response): Promise<void> {
     const setting:HostSetting = this.getSetting(request.get('Host'));

     return res.render(`./views/languages/${setting.language}/faq/main.njk`);
  }

  @Get(`termsofservivce`)
  public async getTerms(@Req() request: Request, @Res() res: Response): Promise<void> {
     const setting:HostSetting = this.getSetting(request.get('Host'));

     return res.render(`./views/languages/${setting.language}/termsofservivce/main.njk`);
  }
  @Get(`privacy`)
  public async getPrivacy(@Req() request: Request, @Res() res: Response): Promise<void> {
    const setting:HostSetting = this.getSetting(request.get('Host'));

    return res.render(`./views/languages/${setting.language}/privacy/main.njk`);
  }
  @Get(`about`)
  public async getAbout(@Req() request: Request, @Res() res: Response): Promise<void> {
    const setting:HostSetting = this.getSetting(request.get('Host'));

    return res.render(`./views/languages/${setting.language}/about/main.njk`);
  }
  @Post(`order`)
  public async getOrder(@Req() request: Request, @Body() data: OrderDto, @Res() res: Response): Promise<void> {
    const setting:HostSetting = this.getSetting(request.get('Host'));

    let {offer, source, quantity, price} = data;
    const artworkMarketData: any = await this.marketService.getArtworkPage(setting.marketplace, offer);
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

    return res.render(`./views/languages/${setting.language}/order/main.njk`, { artwork:artworkMarketData.offer,  position:position, typeArtwork, price, quantity, sum});

  }

  @Get('success')
  public async successPay(@Req() request: Request, @Res() res: Response): Promise<void> {

    const setting:HostSetting = this.getSetting(request.get('Host'));
    let order_uuid = request.query.order;
    if(setting.marketplace == `joincharible`)
    {
       const {session_id} = request.query;
       const session = await this.stripeService.retrieve(session_id);
       order_uuid = session.metadata.order_uuid;
    }

    const paid = await this.operationService.createPaid(setting.marketplace, order_uuid);
    const certificateData: any = await this.certificateService.getPaid(setting.marketplace, paid.uuid);
    return res.render(`./views/languages/${setting.language}/certificate/main.njk`, { paid: paid.uuid, holder:certificateData.holder,  certificates:certificateData.certificates});

//    console.log('successPay', paid);
//    return res.render(`./views/languages/en/successfully/main.njk`, {});
  }

  @Get('cancel')
  public async cancelPay(@Req() request: Request, @Res() res: Response): Promise<void> {
//     console.log('cancelPay', data);
    const setting:HostSetting = this.getSetting(request.get('Host'));
    let order_uuid = request.query.order;
    if(setting.marketplace == `joincharible`)
    {
       const {session_id} = request.query;
       const session = await this.stripeService.retrieve(session_id);
       order_uuid = session.metadata.order_uuid;
    }
    return res.redirect('/');
//     return res.render(`./views/languages/en/successfully/main.njk`, {});

  }

  private async pay(res: Response, marketplace: string, order:string, data: OrderArtworkDto): Promise<void> {
     if(marketplace == `joincharible`)
     {
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
       const session = await this.stripeService.checkout([item], order, `success`, `cancel`);
       return res.redirect(303, session.url);
     }
     const item = {
                    "Amount": data.price * data.quantity * 100,
                    "OrderId": order,
                    "Description": "Пожертвование на сумму " + data.price * data.quantity + " рублей",
                    "DATA": {
                              "Email": data.email
                     },
                     "PayType": "O",
                     "SuccessURL": `${process.env.SERVER_DOMAIN_RU}/success?order=${order}`,
                     "FailURL": `${process.env.SERVER_DOMAIN_RU}/cancel?order=${order}`,

                  }
     const session = await this.tinkoffService.init(item);
     if(session.Success)
       return res.redirect(303, session.PaymentURL);
     return res.redirect('/');
  }

  @Post(`order_artwork`)
  public async createOrderAndPay(@Req() request: Request, @Body() data: OrderArtworkDto, @Res() res: Response): Promise<void> {
     const setting:HostSetting = this.getSetting(request.get('Host'));
     const orderItem: SourceItemDto = { uuid: data.source,
                                        quantity: data.quantity,
                                        price: data.price
                                      };
     const orderData: CreateOrderDto = { sources: [orderItem],
                                         fullname: data.fullname, 
                                         phone: data.phone,
                                         email: data.email
                                       };

     const order:any = await this.operationService.createOrder(setting.marketplace, orderData);
     return await this.pay(res, setting.marketplace, order.uuid, data);
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
    const setting:HostSetting = this.getSetting(request.get('Host'));
    const {uuid} = request.query;
    const artworkMarketData: any = await this.marketService.getArtworkPage(setting.marketplace, uuid);
    return res.render(`./views/languages/${setting.language}/artwork/main.njk`, { artwork:artworkMarketData.offer,  organizations:artworkMarketData.subjects_gallery});
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
  public async getOrganization(@Req() request: Request, @Param(`organization`) organization: string, @Res() res: Response): Promise<void> {
     const setting:HostSetting = this.getSetting(request.get('Host'));



    const uuidOrganization = this.getUUIDByName(organization);
    if(uuidOrganization == undefined)
    {
       const mainMarketData: any = await this.marketService.getMainPage(setting.marketplace);
       return res.render(`./views/languages/${setting.language}/main/main.njk`, { gallery:mainMarketData.gallery,  organizations:mainMarketData.subjects_gallery});
    }

    const organizationMarketData: any = await this.marketService.getOrganizationPage(setting.marketplace, uuidOrganization);

    return res.render(`./views/languages/${setting.language}/organization/main.njk`, { organization:organizationMarketData.subject_gallery});
  }

}