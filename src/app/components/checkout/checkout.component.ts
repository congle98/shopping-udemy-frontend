import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Luv2ShopFormService} from "../../services/luv2-shop-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {Luv2ShopValidators} from "../../validators/luv2-shop-validators";
import {CartService} from "../../services/cart.service";
import {CheckoutService} from "../../services/checkout.service";
import {Router} from "@angular/router";
import {Customer} from "../../common/customer";
import {Order} from "../../common/order";
import {OrderItem} from "../../common/order-item";
import {Purchase} from "../../common/purchase";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup;
  creditCardYears: number[] = [];
  creditCardMonth: number[] = [];
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService,
              private cartService:CartService,
              private checkoutService:CheckoutService,
              private router:Router
  ) {
  }

  ngOnInit(): void {
    this.reviewCartDetail();
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group(
        {
          // firstName: [""],
          // lastName: [""],
          // email: [""]
          firstName: new FormControl(
            "",[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhitespace]),
          lastName:  new FormControl(
            "",[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhitespace]),
          email:  new FormControl(
            "",[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
        }),
      shippingAddress: this.formBuilder.group(
        {
          street: new FormControl(
            "",[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhitespace]),
          city: new FormControl(
            "",[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhitespace]),
          state: new FormControl(
            "",[Validators.required]),
          country: new FormControl(
            "",[Validators.required]),
          zipCode: new FormControl(
            "",[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhitespace]),
        }
      ),
      billingAddress: this.formBuilder.group(
        {
          street: new FormControl(
            "",[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhitespace]),
          city: new FormControl(
            "",[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhitespace]),
          state: new FormControl(
            "",[Validators.required]),
          country: new FormControl(
            "",[Validators.required]),
          zipCode: new FormControl(
            "",[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhitespace]),
        }),
      creditCard: this.formBuilder.group(
        {
          cartType: new FormControl(
            "",[Validators.required]),
          nameOnCard: new FormControl(
            "",[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhitespace]),
          cardNumber: new FormControl(
            "",[Validators.required,Validators.pattern("[0-9]{16}")]),
          securityCode: new FormControl(
            "",[Validators.required,Validators.pattern("[0-9]{3}")]),
          expirationMonth: new FormControl(
            ""),
          expirationYear:new FormControl(
            ""),
        })
    })
    const startMonth: number = new Date().getMonth() + 1;
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonth = data
    )
    this.luv2ShopFormService.getCreditCardYear().subscribe(
      data => this.creditCardYears = data
    )
    //get countries
    this.luv2ShopFormService.getCountries().subscribe(data => this.countries = data)



  }
  get firstName(){
    return this.checkoutFormGroup.get("customer.firstName");
  }
  get lastName(){
    return this.checkoutFormGroup.get("customer.lastName");
  }
  get email(){
    return this.checkoutFormGroup.get("customer.email");
  }
  get shippingAddressStreet(){
    return this.checkoutFormGroup.get("shippingAddress.street");
  }
  get shippingAddressCity(){
    return this.checkoutFormGroup.get("shippingAddress.city");
  }
  get shippingAddressState(){
    return this.checkoutFormGroup.get("shippingAddress.state");
  }
  get shippingAddressCountry(){
    return this.checkoutFormGroup.get("shippingAddress.country");
  }

  get shippingAddressZipcode(){
    return this.checkoutFormGroup.get("shippingAddress.zipcode");
  }
  get billingAddressStreet(){
    return this.checkoutFormGroup.get("billingAddress.street");
  }
  get billingAddressCity(){
    return this.checkoutFormGroup.get("billingAddress.city");
  }
  get billingAddressState(){
    return this.checkoutFormGroup.get("billingAddress.state");
  }
  get billingAddressCountry(){
    return this.checkoutFormGroup.get("billingAddress.country");
  }

  get billingAddressZipcode(){
    return this.checkoutFormGroup.get("billingAddress.zipcode");
  }
  get creditCardType(){
    return this.checkoutFormGroup.get("creditCard.cartType");
  }
  get creditCardNameOnCard(){
    return this.checkoutFormGroup.get("creditCard.nameOnCard");
  }
  get creditCardCardNumber(){
    return this.checkoutFormGroup.get("creditCard.cardNumber");
  }
  get creditCardSecurityCode(){
    return this.checkoutFormGroup.get("creditCard.securityCode");
  }
  get creditCardExpirationMonth(){
    return this.checkoutFormGroup.get("creditCard.expirationMonth");
  }
  get creditCardExpirationYear(){
    return this.checkoutFormGroup.get("creditCard.expirationYear");
  }




  onSubmit() {
    //xịn luôn
    // console.log(this.checkoutFormGroup.get("customer")?.value);
    //
    // console.log(this.checkoutFormGroup.get("customer")?.value.lastName);
    if(this.checkoutFormGroup.invalid){
      //nếu form còn lỗi validate thì sẽ tự động touched để thông báo tất cả các lỗi
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    let order:Order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    const cartItems = this.cartService.cartItems;
    // let orderItems:OrderItem[] = [];
    // for (let i = 0; i < cartItems.length; i++) {
    //   // let orderItem = new OrderItem(cartItems[i]);
    //   // orderItems.push(orderItem);
    //   //hoặc ntn đỉnh vcll :V
    //   orderItems[i]= new OrderItem(cartItems[i]);
    // }
    //hoặc ntn nè
    let orderItemsShort: OrderItem[] = cartItems.map(item => new OrderItem(item));

    let purchase = new Purchase();
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    //shipping
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    console.log(purchase.shippingAddress);
    const shippingState:State = JSON.parse(JSON.stringify(purchase.shippingAddress.state))
    const shippingCountry:Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country))
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //billing
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState:State = JSON.parse(JSON.stringify(purchase.billingAddress.state))
    const billingCountry:Country = JSON.parse(JSON.stringify(purchase.billingAddress.country))
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.order = order;
    purchase.orderItems = orderItemsShort;
    this.checkoutService.placeOrder(purchase).subscribe(data => {
      alert("đơn hàng có mã "+data.orderTrackingNumber+" đã được gửi thành công");
      this.resetCart();
      },
      error => alert(error.message));
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.billingAddressStates = this.shippingAddressStates;
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);
    } else {
      this.billingAddressStates=[]
      this.checkoutFormGroup.controls.billingAddress.reset();
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get("creditCard");
    const currentYear: number = new Date().getFullYear();
    const selectYear: number = +creditCardFormGroup?.value.expirationYear;
    let starMonth: number;
    if (currentYear === selectYear) {
      starMonth = new Date().getMonth() + 1;
    } else {
      starMonth = 1;
    }
    this.luv2ShopFormService.getCreditCardMonths(starMonth).subscribe(data => this.creditCardMonth = data);
  }

  getSates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;
    this.luv2ShopFormService.getStates(countryCode).subscribe(data => {
      if (formGroupName === "shippingAddress") {
        this.shippingAddressStates = data
      } else {
        this.billingAddressStates = data
      }
      formGroup?.get("state")?.setValue(data[0])
    })
  }

  private reviewCartDetail() {
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);
  }

  private resetCart() {
    this.cartService.cartItems =[];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl("/products");
  }
}
