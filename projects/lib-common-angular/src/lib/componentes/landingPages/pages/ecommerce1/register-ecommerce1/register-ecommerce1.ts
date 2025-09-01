import { Component } from '@angular/core';
import { SectionHeaderFormsLoginEcomerce1 } from "../../../atoms/ecommerce1/section-header-forms-login-ecomerce1/section-header-forms-login-ecomerce1";
import { FormAuthEccomerce1 } from "../../../molecules/ecommerce1/form-auth-eccomerce1/form-auth-eccomerce1";

@Component({
  selector: 'lib-register-ecommerce1',
  imports: [SectionHeaderFormsLoginEcomerce1, FormAuthEccomerce1],
  templateUrl: './register-ecommerce1.html',
  styleUrl: './register-ecommerce1.scss'
})
export class RegisterEcommerce1 {

}
