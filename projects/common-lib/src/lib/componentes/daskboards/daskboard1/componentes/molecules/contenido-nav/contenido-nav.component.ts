import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Link1Component } from '../../atoms/link1/link1.component';
import { BussinesDTO } from '../../../models/BussinesDTO'
import { Footer1Component } from '../footer1/footer1.component';
import { SelectInput1Component } from '../../../../../../shared/select-input1/select-input1.component';
import { PlantillaDTO } from '../../../models/PlantillaDTO';

@Component({
  selector: 'app-contenido-nav',
  templateUrl: './contenido-nav.component.html',
  styleUrls: ['./contenido-nav.component.scss'],
  standalone: true,
  imports:[IonicModule,Link1Component,Footer1Component, SelectInput1Component]
})
export class ContenidoNavComponent  implements OnInit {
  
 
  @Input()
   lenguages :string[]=[]
  @Input()
   negocio : PlantillaDTO  = {
     id: '',
     bussinesDTO: undefined,
     slider: [],
     menu: undefined
   }  

  constructor() {
   if(this.negocio.bussinesDTO)
     this.negocio.bussinesDTO.urlWhatssapp = this.generarUrlWhatsapp(this.negocio?.bussinesDTO);
   }
  
  ngOnInit(): void {

    console.log("prueba" , this.negocio)
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
