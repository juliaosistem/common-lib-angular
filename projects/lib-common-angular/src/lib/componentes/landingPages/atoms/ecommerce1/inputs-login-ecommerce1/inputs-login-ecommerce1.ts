import { Component } from '@angular/core';
import { PrimegModule } from '../../../../../modulos/primeg.module';

@Component({
  selector: 'lib-inputs-login-ecommerce1',
  imports: [PrimegModule],
  templateUrl: './inputs-login-ecommerce1.html',
  styleUrl: './inputs-login-ecommerce1.scss'
})
export class InputsLoginEcommerce1 {
  remember = false;

  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRememberChange(event: any): void {
    this.remember = !!event?.checked;
  }
}
