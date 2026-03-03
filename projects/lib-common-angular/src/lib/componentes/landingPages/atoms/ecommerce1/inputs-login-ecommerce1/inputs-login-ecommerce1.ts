import { Component, Input } from '@angular/core';
import { PrimegModule } from '../../../../../modulos/primeg.module';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-inputs-login-ecommerce1',
  imports: [PrimegModule, ReactiveFormsModule, CommonModule],
  templateUrl: './inputs-login-ecommerce1.html',
  styleUrl: './inputs-login-ecommerce1.scss'
})
export class InputsLoginEcommerce1 {
  @Input() parentForm!: FormGroup;
  remember = false;

  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRememberChange(event: any): void {
    this.remember = !!event?.checked;
  }
}
