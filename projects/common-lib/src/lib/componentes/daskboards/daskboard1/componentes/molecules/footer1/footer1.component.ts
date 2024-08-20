import { Component, Input } from '@angular/core';
import { PlantillaDTO } from '../../../models/PlantillaDTO';

@Component({
  selector: 'lib-footer1',
  standalone: true,
  imports: [],
  templateUrl: './footer1.component.html',
  styleUrl: './footer1.component.css'
})
export class Footer1Component {

  idComponent = 1 
  tipoComponente ="footer"

  @Input()
  negocio: PlantillaDTO | undefined  ;
  Year:string =  new Date().getFullYear().toString()

}
