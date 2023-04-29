import { ForbiddenException, Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { map, catchError, lastValueFrom } from 'rxjs';

@Injectable()
export class MarketService {
   constructor(private http: HttpService) {}

   async getMainPage()
   {
       const request = this.http
                  .get(`https://api.tokendobra.ru/v.1.0.0/api/marketpoint/joincharible/main`)

                  .pipe(
                          map((res) => res.data),
                        )
                  .pipe(
                         catchError(() => {
                              throw new ForbiddenException(`API not available`);
                       }),
                   );
        const result = await lastValueFrom(request);
        return result.data;
   }
   async getArtworkPage(offer)
   {
       const request = this.http
                  .get(`https://api.tokendobra.ru/v.1.0.0/api/marketpoint/joincharible/creation`, {params:{offer}})

                  .pipe(
                          map((res) => res.data),
                        )
                  .pipe(
                         catchError(() => {
                              throw new ForbiddenException(`API not available`);
                       }),
                   );
        const result = await lastValueFrom(request);
        return result.data;
   }

}
