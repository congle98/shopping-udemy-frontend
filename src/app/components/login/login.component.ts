import { Component, OnInit } from '@angular/core';
import {OktaAuthStateService} from "@okta/okta-angular";
// @ts-ignore
import * as OktaSignIn from "@okta/okta-signin-widget";
import myAppConfig from "./../../config/my-app-config"
import {OktaAuth} from "@okta/okta-auth-js";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  oktaSignin:any;
  constructor(private oktaAuthService:OktaAuth) {
    this.oktaSignin = new OktaSignIn({
      logo:'asets/images/logo/png',
      baseUrl: myAppConfig.oidc.issuer.split("/oauth2")[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams:{
        pkce:true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
      }
    )
  }

  ngOnInit(): void {
    this.oktaSignin.remove();
    this.oktaSignin.renderEl(
      {
      el: "#okta-sign-in-widget"
      },
      (response:any) =>{
        if(response.status ==="SUCCESS"){
          this.oktaAuthService.signInWithRedirect();
        }
      },
      (error:any) =>{
        throw error;
      }
    )
  }

}
