import { ForbiddenException, Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { map, catchError, lastValueFrom } from 'rxjs';

@Injectable()
export class MarketService {
   private backERP_API:string;
   constructor(private http: HttpService) {
     this.backERP_API = process.env.BACKERP_API;
   }
   getAPI(method)
   {
      return `${ this.backERP_API }marketpoint/joincharible/${ method }`;
   }
   async getMainPage()
   {
       const request = this.http
                  .get(this.getAPI(`main`))

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
                  .get(this.getAPI(`creation`), {params:{offer}})

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
   async getOrganizationPage(subject)
   {
       const request = this.http
                  .get(this.getAPI(`organization`), {params:{subject}})

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
