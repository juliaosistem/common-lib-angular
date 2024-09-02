import { Component, Input } from '@angular/core';
import { PlantillaDTO } from '../../../models/PlantillaDTO';

@Component({
  selector: 'lib-layout-services1',
  standalone: true,
  imports: [],
  templateUrl: './layout-services1.component.html',
  styleUrl: './layout-services1.component.css'
})
export class LayoutServices1Component {
  @Input()
  negocio : PlantillaDTO  = {
    id: '',
    bussinesDTO: undefined,
    slider: [],
    menu: undefined
  }  
}
