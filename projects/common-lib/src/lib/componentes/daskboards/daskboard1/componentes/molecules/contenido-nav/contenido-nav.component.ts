import { Component, Input, OnInit,Renderer2, ViewChild } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { Link1Component } from '../../atoms/link1/link1.component';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonCall1Component } from '../../atoms/button-call1/button-call1.component';
import { SelectInput1Component } from '../../../../../shared/atoms/select-input1/select-input1.component';

import { ComponentesDTO } from 'juliaositembackenexpress/dist/api/dtos/bussines/componentesDTO';


import { BusinessDTO } from 'juliaositembackenexpress/dist/api/dtos/bussines/businessDTO';
import { PlantillaDTO } from 'juliaositembackenexpress/dist/api/dtos/bussines/PlantillaDTO';


@Component({
  selector: 'app-contenido-nav',
  templateUrl: './contenido-nav.component.html',
  styleUrls: ['./contenido-nav.component.scss'],
  standalone: true,
  imports:[IonicModule,Link1Component, ButtonCall1Component,
    SelectInput1Component,TranslateModule]
})
export class ContenidoNavComponent  implements OnInit {


  componente:ComponentesDTO = {
    id: '2da5cdea-096d-4147-b6f0-9c427e5b67d6',
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
