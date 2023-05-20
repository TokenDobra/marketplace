import { ForbiddenException, Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { map, catchError, lastValueFrom } from 'rxjs';


@Injectable()
export class TinkoffService {
   constructor(private http: HttpService) {
   }

   getAPI(method)
   {
      return `https://securepay.tinkoff.ru/v2/${ method }`;
   }
   async init(data: any)
   {
       data.TerminalKey = process.env.TINKOFF_TERNINAL_KEY;
       console.log('req data', data);
       const request = this.http
                  .post(this.getAPI(`Init`), data)

                  .pipe(
                          map((res) => res.data),
                        )
                  .pipe(
                         catchError(() => {
                              throw new ForbiddenException(`API not available`);
                       }),
                   );
        const result = await lastValueFrom(request);
        return result;
   }


}
