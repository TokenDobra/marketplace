import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MarketService } from './market/market.service';
import { HttpModule } from "@nestjs/axios";


@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, MarketService],
})
export class AppModule {

}
