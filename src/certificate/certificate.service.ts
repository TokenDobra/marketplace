import { ForbiddenException, Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { map, catchError, lastValueFrom } from 'rxjs';

@Injectable()
export class CertificateService {
   private backERP_API:string;
   constructor(private http: HttpService) {
     this.backERP_API = process.env.BACKERP_API;
   }
   getAPI(marketplace, method)
   {
      return `${ this.backERP_API }certificates/${marketplace}/${ method }`;
   }
   async getPaid(marketplace, uuid)
   {
       const request = this.http
                  .get(this.getAPI(marketplace, `paid`), {params:{uuid}})

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
