import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Country} from "../common/country";
import {map} from "rxjs/operators";
import {State} from "../common/state";

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {
  urlCountry:string = environment.url+"/countries";
  urlState:string = environment.url+"/states";
  constructor(private httpClient:HttpClient) { }
  getCountries():Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.urlCountry).pipe(map(response => response._embedded.countries))
  }
  getStates(countryCode:string):Observable<State[]>{
    return this.httpClient.get<GetResponseStates>(this.urlState+"/search/findByCountryCode?code="+countryCode).pipe(map(response => response._embedded.states))
  }
  getCreditCardMonths(startMonth:number):Observable<number[]>{
    //ý nghĩa là để lấy từ tháng hiện tại trở đi :v, login xịn xò đấy
    let data:number[] = [];
    for (let theMonth = startMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }
    return of(data)
  }
  getCreditCardYear():Observable<number[]>{
    //lấy từ năm hiện tại thêm 10 năm nữa :v
    let data:number[] = [];
    const startYear:number = new Date().getFullYear();
    const endYear:number = startYear + 10;
    for (let theYear = startYear;theYear <=endYear; theYear++){
      data.push(theYear);
    }
    return of(data);
  }


}
interface GetResponseCountries{
  _embedded:{
    countries:Country[]
  }
}
interface GetResponseStates{
  _embedded:{
    states:State[]
  }
}
