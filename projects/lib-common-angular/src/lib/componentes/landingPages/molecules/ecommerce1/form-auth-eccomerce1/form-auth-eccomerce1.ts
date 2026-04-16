import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PrimegModule } from '../../../../../modulos/primeg.module';
import { SectionLoginRegistroEcomerce1 } from "../../../atoms/ecommerce1/section-login-registro-ecomerce1/section-login-registro-ecomerce1";
import { InputsLoginEcommerce1 } from "../../../atoms/ecommerce1/inputs-login-ecommerce1/inputs-login-ecommerce1";
import { ButtonsSocialmediaLogin } from "../../../atoms/ecommerce1/buttons-socialmedia-login/buttons-socialmedia-login";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginDTO, RegisterUserDTO } from '@juliaosistem/core-dtos';

@Component({
  selector: 'lib-form-auth-eccomerce1',
  imports: [PrimegModule, SectionLoginRegistroEcomerce1, InputsLoginEcommerce1, ButtonsSocialmediaLogin, ReactiveFormsModule, CommonModule],
  templateUrl: './form-auth-eccomerce1.html',
  styleUrl: './form-auth-eccomerce1.css'
})
export class FormAuthEccomerce1 {
  
  @Input() isRegistering = true;
  @Input() isLogout = false;
  @Output() login = new EventEmitter<LoginDTO>();
  @Output() register = new EventEmitter<RegisterUserDTO>();

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (!this.isRegistering && this.loginForm.valid) {
      this.login.emit(this.loginForm.value);
    } else if (this.isRegistering && this.registerForm.valid) {
      const { name, email, password, confirmPassword } = this.registerForm.value;
      if (password === confirmPassword) {
        this.register.emit({ name, email, password } as RegisterUserDTO);
      } else {
        // Aquí podrías emitir un error o manejar la validación de contraseñas
      }
    }
  }

}
