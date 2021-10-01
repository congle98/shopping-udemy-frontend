import { Component, OnInit } from '@angular/core';
import {GetResponseProducts, ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;
  thePageNumber:number = 1;
  thePageSize:number = 8;
  theTotalElements: number = 0;
  previousKeyWord: string|null;
  constructor(private productService:ProductService,private route:ActivatedRoute,
              private cartService:CartService) { }

  ngOnInit(): void {
    //theo dõi thay đổi của url
    this.route.paramMap.subscribe(()=>{
      this.getProductList()
    })
  }

  getProductList(){
    this.searchMode = this.route.snapshot.paramMap.has("keyword");
    if(this.searchMode){
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }
  handleSearchProducts() {
    let theKeyword = this.route.snapshot.paramMap.get("keyword")
    if(this.previousKeyWord != theKeyword){
      this.thePageNumber = 1;
    }
    this.previousKeyWord = theKeyword;
    this.productService.searchProducts(this.thePageNumber-1,
        this.thePageSize,theKeyword?theKeyword:"").subscribe(data => this.processResult(data))
  }

  handleListProducts(){
    const  hasCategoryId:boolean = this.route.snapshot.paramMap.has("id");

    if(hasCategoryId){
      // @ts-ignore
      this.currentCategoryId = +this.route.snapshot.paramMap.get("id");
    }

    //tránh trường hợp nhảy sang category khác vẫn giữ nguyên page đang đứng :v
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    //phân trang bootstrap nó bắt đầu từ 1. mà pageable bắt đầu từ 0 nên phải tăng giảm 1 đơn vị
    this.productService.getProductListPaginate(
        this.thePageNumber-1,
        this.thePageSize,
        this.currentCategoryId).subscribe(data => this.processResult(data));
  }
  processResult(data:GetResponseProducts){
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number+1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;

  }
  updatePageSize(event:any){
    const pageSize = event.target.value;
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.getProductList();
  }

  addToCart(product:Product){
    const cartItem:CartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }

}
