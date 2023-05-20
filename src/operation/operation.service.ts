import { ForbiddenException, Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { map, catchError, lastValueFrom } from 'rxjs';

export class SourceItemDto
{
  uuid: string;
  quantity: number; 
  price: number; 
}
export class CreateOrderDto {
  sources: SourceItemDto[];
  fullname:string; 
  phone:string; 
  email:string;
}


@Injectable()
export class OperationService {
   private backERP_API:string;
   constructor(private http: HttpService) {
     this.backERP_API = process.env.BACKERP_API;
   }
   getAPI(marketplace,method)
   {
      return `${ this.backERP_API }operations/${ method }`;
   }
   async createOrder(marketplace:string, data: CreateOrderDto)
   {
       const request = this.http
                  .post(this.getAPI(marketplace, `makeOrder`), data)

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
   async createPaid(marketplace:string, order:any)
   {
       const request = this.http
                  .post(this.getAPI(marketplace, `makePaid`), {order, marketplace})

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
