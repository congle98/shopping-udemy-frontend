import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Luv2ShopFormService} from "../../services/luv2-shop-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {Luv2ShopValidators} from "../../validators/luv2-shop-validators";

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
              private luv2ShopFormService: Luv2ShopFormService
  ) {
  }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group(
        {
          // firstName: [""],
          // lastName: [""],
          // email: [""]
          firstName: new FormControl("",[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhitespace]),
          lastName:  new FormControl("",[Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhitespace]),
          email:  new FormControl("",[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
        }),
      shippingAddress: this.formBuilder.group(
        {
          street: [""],
          city: [""],
          state: [""],
          country: [""],
          zipcode: [""],
        }
      ),
      billingAddress: this.formBuilder.group(
        {
          street: [""],
          city: [""],
          state: [""],
          country: [""],
          zipcode: [""],
        }),
      creditCard: this.formBuilder.group(
        {
          cartType: [""],
          nameOnCard: [""],
          cardNumber: [""],
          securityCode: [""],
          expirationMonth: [""],
          expirationYear: [""]
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

  onSubmit() {
    //xịn luôn
    // console.log(this.checkoutFormGroup.get("customer")?.value);
    //
    // console.log(this.checkoutFormGroup.get("customer")?.value.lastName);

    if(this.checkoutFormGroup.invalid){
      //nếu form còn lỗi validate thì sẽ tự động touched để thông báo tất cả các lỗi
      this.checkoutFormGroup.markAllAsTouched();
    }
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
}
