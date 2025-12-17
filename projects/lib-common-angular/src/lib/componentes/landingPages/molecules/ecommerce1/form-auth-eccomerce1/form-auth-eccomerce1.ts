import { Component, Input } from '@angular/core';
import { PrimegModule } from '../../../../../modulos/primeg.module';
import { SectionLoginRegistroEcomerce1 } from "../../../atoms/ecommerce1/section-login-registro-ecomerce1/section-login-registro-ecomerce1";
import { InputsLoginEcommerce1 } from "../../../atoms/ecommerce1/inputs-login-ecommerce1/inputs-login-ecommerce1";
import { ButtonsSocialmediaLogin } from "../../../atoms/ecommerce1/buttons-socialmedia-login/buttons-socialmedia-login";
import { InputsRegisterEcommerce1 } from '../../../atoms/ecommerce1/inputs-register-ecommerce1/inputs-register-ecommerce1';

@Component({
  selector: 'lib-form-auth-eccomerce1',
  imports: [PrimegModule, SectionLoginRegistroEcomerce1, InputsLoginEcommerce1, ButtonsSocialmediaLogin, InputsRegisterEcommerce1],
  templateUrl: './form-auth-eccomerce1.html',
  styleUrl: './form-auth-eccomerce1.css'
})
export class FormAuthEccomerce1 {
  
  @Input() isRegistering = true;
  @Input() isLogout = false;

}
