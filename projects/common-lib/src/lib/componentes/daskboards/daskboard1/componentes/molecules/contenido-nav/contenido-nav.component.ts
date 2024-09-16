import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Link1Component } from '../../atoms/link1/link1.component';
import { BussinesDTO } from '../../../models/BussinesDTO'
import { Footer1Component } from '../footer1/footer1.component';
import { SelectInput1Component } from '../../../../../../shared/select-input1/select-input1.component';
import { PlantillaDTO } from '../../../models/PlantillaDTO';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonCall1Component } from '../../atoms/button-call1/button-call1.component';
import { ComponentesDTO } from '../../../models/componentesDTO';

@Component({
  selector: 'app-contenido-nav',
  templateUrl: './contenido-nav.component.html',
  styleUrls: ['./contenido-nav.component.scss'],
  standalone: true,
  imports:[IonicModule,Link1Component,Footer1Component, ButtonCall1Component,
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

  generarUrlWhatsapp(bussines: BussinesDTO): string {
    const numeroCompleto = `+${bussines.codigoPais}${bussines.telofono}`;
    const mensajePredeterminado = encodeURIComponent(
        `Hola, estoy interesado en sus servicios.` +
        'estamos viendo su pagina web'
    );

    return `https://wa.me/${numeroCompleto}/?text=${mensajePredeterminado}`;
}


}
