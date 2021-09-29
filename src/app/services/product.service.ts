import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Product} from "../common/product";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url:string = environment.url+"/products";
  constructor(private httpClient:HttpClient) {
    console.log(this.url);
  }
  getProductList():Observable<Product[]>{
    return this.httpClient.get<GetResponse>(this.url).pipe(
      map(response => response._embedded.products)
    )
  }

}
interface GetResponse{
  _embedded:{
    products:Product[]
  }
}
