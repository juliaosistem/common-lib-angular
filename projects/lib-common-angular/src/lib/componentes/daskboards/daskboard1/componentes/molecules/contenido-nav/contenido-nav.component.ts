import { Component, Input, OnInit } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import {BusinessDTO, ComponentesDTO, PlantillaDTO} from '@juliaosistem/core-dtos'

@Component({
  selector: 'app-contenido-nav',
  templateUrl: './contenido-nav.component.html',
  styleUrls: ['./contenido-nav.component.scss'],
  standalone: true,
  imports:[IonicModule,TranslateModule]
})
export class ContenidoNavComponent  implements OnInit {


  componente:ComponentesDTO = {
    id: 4,
    nombreComponente: 'app-contenido-nav',
    version: '1.0',
  }
  
  
 
  @Input()
   lenguages :string[]=[]

  
  @Input()
   negocio : PlantillaDTO  = {
     id: '',
     bussinesDTO: undefined,
     menu: undefined
   }  

  constructor() {
   if(this.negocio.bussinesDTO)
     this.negocio.bussinesDTO.urlWhatssapp = this.generarUrlWhatsapp(this.negocio?.bussinesDTO);
   }
  
  ngOnInit(): void {
  }

  generarUrlWhatsapp(bussines: BusinessDTO): string {
    const numeroCompleto = `+${bussines.codigoPais}${bussines.telefono}`;
    const mensajePredeterminado = encodeURIComponent(
        `Hola, estoy interesado en sus servicios.` +
        'estamos viendo su pagina web'
    );

    return `https://wa.me/${numeroCompleto}/?text=${mensajePredeterminado}`;
}


}
