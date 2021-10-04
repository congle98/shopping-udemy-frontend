import { Component, OnInit } from '@angular/core';
import {OktaAuthStateService} from "@okta/okta-angular";

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated:boolean = false;
  userFullName:string;
  constructor(
    // private  oktaAuthService:OktaAuthStateService
  ) { }

  ngOnInit(): void {
    // this.oktaAuthService.authState$.subscribe((result)=>{
    //   this.isAuthenticated = result;
    //   this.getUserDetails();
    // })
  }
  // getUserDetails(){
  //   if(this.isAuthenticated){
  //     this.oktaAuthService.getUser().then(
  //       (res)=>{
  //         this.userFullName = res.name;
  //       }
  //     )
  //   }
  // }
  // logout(){
  //   this.oktaAuthService.signOut();
  // }

}
