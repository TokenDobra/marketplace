import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as nunjucks from 'nunjucks';

const ROOT_DIR: string = join(__dirname, '..');
const IS_PRODUCTION: boolean = process.env.NODE_ENV === 'production';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  const port: number = 3005;
  const opts: nunjucks.ConfigureOptions = { express: app, autoescape: true, watch: !IS_PRODUCTION, noCache: !IS_PRODUCTION };

  nunjucks.configure(join(ROOT_DIR, IS_PRODUCTION ? 'dist' : 'src'), opts);

  app.enableCors();
  app.set('trust proxy', 1);
  app.set('view engine', 'njk');
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
}

bootstrap();
