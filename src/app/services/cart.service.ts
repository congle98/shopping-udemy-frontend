import { Injectable } from '@angular/core';
import {CartItem} from "../common/cart-item";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems : CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity:Subject<number> = new Subject<number>();
  constructor() { }

  addToCart(theCartItem:CartItem){
    let alreadyExistsInCart:boolean = false;
    let existingCartItem: CartItem | undefined;
    if(this.cartItems.length>0){
      // for (let tempItem of this.cartItems){
      //   if(tempItem.id==theCartItem.id){
      //     existingCartItem = tempItem;
      //     break;
      //   }
      //mã này xịn hơn
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      // @ts-ignore
      alreadyExistsInCart = (existingCartItem !== undefined);
    }
    if(alreadyExistsInCart){
      // @ts-ignore
      existingCartItem.quantity++;
    }
    else {
      this.cartItems.push(theCartItem);
    }
    this.computeCartTotals();
  }

  computeCartTotals(){
    let totalPriceValue:number = 0;
    let totalQuantityValue:number = 0;
    for (let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantityValue += currentCartItem.quantity;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    // this.logCartData(totalPriceValue,totalQuantityValue);
  }
  logCartData(totalPriceValue:number,totalQuantityValue:number){
    console.log("giở hàng");
    for (let temCartItem of this.cartItems){
      const  subTotalPrice = temCartItem.quantity * temCartItem.unitPrice;
      console.log("name "+temCartItem.name, "quantity "+temCartItem.quantity,"unitprice "+temCartItem.unitPrice,"totalPrice "+subTotalPrice);
    }
    console.log("totalPrice "+totalPriceValue.toFixed(2),"totalQuantity "+totalQuantityValue)
    console.log("........");

  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity-=1;
    if(cartItem.quantity===0){
      this.remove(cartItem);
    }
    else {
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem) {
    const index = this.cartItems.findIndex(tempCartItem => tempCartItem.id === cartItem.id);
    if(index > -1){
      this.cartItems.splice(index,1);
      this.computeCartTotals();
    }

  }
}
