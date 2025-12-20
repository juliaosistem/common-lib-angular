import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SectionHeaderFormsLoginEcomerce1 } from "../../../atoms/ecommerce1/section-header-forms-login-ecomerce1/section-header-forms-login-ecomerce1";
import { FormAuthEccomerce1 } from "../../../molecules/ecommerce1/form-auth-eccomerce1/form-auth-eccomerce1";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lib-register-ecommerce1',
  imports: [CommonModule, ButtonModule, SectionHeaderFormsLoginEcomerce1, FormAuthEccomerce1, RouterModule],
  templateUrl: './register-ecommerce1.html',
  styleUrl: './register-ecommerce1.scss'
})
export class RegisterEcommerce1 {

}
