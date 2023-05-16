import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MarketService } from './market/market.service';
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from '@nestjs/config';
import { OperationService } from './operation/operation.service';
import { StripeService } from './stripe/stripe.service';
import { CertificateService } from './certificate/certificate.service';


@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, MarketService, OperationService, StripeService, CertificateService],
})
export class AppModule {

}
