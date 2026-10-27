import { Component, Input } from '@angular/core';
import { BusinessDTO } from '@juliaosistem/core-dtos';


@Component({
  selector: 'lib-button-call1',
  standalone: true,
  imports: [],
  templateUrl: './button-call1.component.html',
  styleUrl: './button-call1.component.css'
})
export class ButtonCall1Component {

  @Input()
  negocio: BusinessDTO = {
    businessModule: [],
    telefono: '',
  };
}
