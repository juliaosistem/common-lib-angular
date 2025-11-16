import { Component, ViewEncapsulation } from '@angular/core';
import { SectionHeaderFormsLoginEcomerce1 } from "../../../atoms/ecommerce1/section-header-forms-login-ecomerce1/section-header-forms-login-ecomerce1";
import { FormAuthEccomerce1 } from "../../../molecules/ecommerce1/form-auth-eccomerce1/form-auth-eccomerce1";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lib-login-ecommerce1',
  imports: [SectionHeaderFormsLoginEcomerce1, FormAuthEccomerce1,RouterModule],
  templateUrl: './login-ecommerce1.html',
  styleUrls: ['./login-ecommerce1.scss'],
  encapsulation: ViewEncapsulation.None

})
export class LoginEcommerce1 {

}
