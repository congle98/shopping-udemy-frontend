import { Component, OnInit } from '@angular/core';
import {OktaAuthStateService} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated:boolean = false;
  userFullName:string | undefined;

  oktaAuthService:OktaAuth;
  constructor(
    // public oktaAuthService:OktaAuth
  ) { }

  ngOnInit(): void {
    this.oktaAuthService.authStateManager.subscribe((result:any)=>{
      this.isAuthenticated = result;
      this.getUserDetails();
    })
  }
  getUserDetails(){
    if(this.isAuthenticated){
      this.oktaAuthService.getUser().then(
        (res)=>{
          this.userFullName = res.name;
        }
      )
    }
  }
  logout(){
    this.oktaAuthService.signOut();
  }

}
