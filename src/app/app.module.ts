import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import {HttpClientModule} from "@angular/common/http";
import {ProductService} from "./services/product.service";
import {Routes,RouterModule} from "@angular/router";
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

const routes:Routes = [
  {
    path:'category/:id',
    component:ProductListComponent
  },
  {
    path:"products/:id",
    component:ProductDetailComponent
  },
  {
    path:'category',
    component:ProductListComponent
  },
  {
    path:'products',
    component:ProductListComponent
  },
  {
    path:'search/:keyword',
    component:ProductListComponent
  },
  {
    path:'cart-details',
    component:CartDetailsComponent
  },
  {
    path:'checkout',
    component:CheckoutComponent
  },
  {
    path:'',
    redirectTo:'/products',
    pathMatch:'full'
  },
  {
    path:'**',
    redirectTo:'/products',
    pathMatch:'full'
  },
]
@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    NgbModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
