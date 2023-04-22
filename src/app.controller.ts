import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getHello(@Res() res: Response): void {
    const headline: string = this.appService.getHello();

    return res.render('./views/languages/ru/main/main.njk', { headline });
  }
}