import { Component, Input } from '@angular/core';
import { ComponentesDTO, PlantillaDTO } from '@juliaosistem/core-dtos';

@Component({
  selector: 'lib-footer1',
  standalone: true,
  imports: [],
  templateUrl: './footer1.component.html',
  styleUrl: './footer1.component.css'
})
export class Footer1Component {

  @Input()
  negocio: PlantillaDTO | undefined  ;
  Year:string =  new Date().getFullYear().toString()

  componente:ComponentesDTO = {
      id: 7,
      nombreComponente: 'lib-footer1',
      version: '1.0',
    }

}
