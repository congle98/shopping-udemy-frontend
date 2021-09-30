import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Product} from "../common/product";
import {map} from "rxjs/operators";
import {ProductCategory} from "../common/product-category";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url:string = environment.url;
  constructor(private httpClient:HttpClient) {
    console.log(this.url);
  }
  getProductList(id:number):Observable<Product[]>{
    const searchUrl = this.url+"/products/search/findByCategoryId?id=";
    return this.httpClient.get<GetResponseProducts>(searchUrl+id).pipe(
      map(response => response._embedded.products)
    )
  }
  getProductListPaginate(thePage:number,thePageSize:number,id:number):Observable<GetResponseProducts>{
    const searchUrl = this.url+"/products/search/findByCategoryId?id=";
    return this.httpClient.get<GetResponseProducts>(`${searchUrl+id}&page=${thePage}&size=${thePageSize}`);
  }

  getProductCategories():Observable<ProductCategory[]>{
    return this.httpClient.get<GetResponseCategories>(this.url+"/product-category").pipe(
      map(response => response._embedded.productCategory)
    );
  }
  searchProducts(thePage:number,thePageSize:number,keyWord:string=""):Observable<GetResponseProducts>{
    const searchUrl = this.url+"/products/search/findByNameContaining?name="
    return this.httpClient.get<GetResponseProducts>(`${searchUrl+keyWord}&page=${thePage}&size=${thePageSize}`);
  }

  getProduct(theProductId: number):Observable<Product> {
    const searchUrl = this.url+"/products/"
    return this.httpClient.get<Product>(searchUrl+theProductId)
  }
}
export interface GetResponseProducts{
  _embedded:{
    products:Product[]
  },
  page:{
    size:number,
    totalElements:number,
    totalPages:number,
    number:number
  }
}

interface GetResponseCategories{
  _embedded:{
    productCategory:ProductCategory[]
  }
}
