import { ForbiddenException, Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { map, catchError, lastValueFrom } from 'rxjs';

@Injectable()
export class MarketService {
   private backERP_API:string;
   constructor(private http: HttpService) {
     this.backERP_API = process.env.BACKERP_API;
   }
   getAPI(marketplace, method)
   {
      return `${ this.backERP_API }marketpoint/${marketplace}/${ method }`;
   }
   async getMainPage(marketplace)
   {
       const request = this.http
                  .get(this.getAPI(marketplace, `main`))

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
   async getArtworkPage(marketplace, offer)
   {
       const request = this.http
                  .get(this.getAPI(marketplace, `creation`), {params:{offer}})

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
   async getOrganizationPage(marketplace, subject)
   {
       const request = this.http
                  .get(this.getAPI(marketplace, `organization`), {params:{subject}})

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
