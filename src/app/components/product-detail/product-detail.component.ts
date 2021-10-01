import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Product} from "../../common/product";
import {ProductService} from "../../services/product.service";
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product:Product;
  constructor(private productService:ProductService,
              private route:ActivatedRoute,
              private cartService:CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.handleProductDetail()
    })
  }
  handleProductDetail(){
    // @ts-ignore
    const  theProductId:number  = +this.route.snapshot.paramMap.get("id");
    this.productService.getProduct(theProductId).subscribe((data)=>{
    this.product = data})
  }

  addToCart(){
    let cartItem:CartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }

}
