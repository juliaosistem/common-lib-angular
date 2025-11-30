import { Component, Input } from '@angular/core';
import { PlantillaDTO } from '@juliaosistem/core-dtos';


@Component({
  selector: 'lib-button-call1',
  standalone: true,
  imports: [],
  templateUrl: './button-call1.component.html',
  styleUrl: './button-call1.component.css'
})
export class ButtonCall1Component {

  @Input()
  negocio : PlantillaDTO  = {
    id: '',
    bussinesDTO: undefined,
    menu: undefined
  }  
}
