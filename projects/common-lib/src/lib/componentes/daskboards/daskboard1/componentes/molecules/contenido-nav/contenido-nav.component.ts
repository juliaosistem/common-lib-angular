import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MenuDTO } from '../../../models/MenuDTO';
import { Link1Component } from '../../atoms/link1/link1.component';
import { BussinesDTO } from '../../../models/BussinesDTO'
import { ColoresDTO } from '../../../models/ColoresDTO';

@Component({
  selector: 'app-contenido-nav',
  templateUrl: './contenido-nav.component.html',
  styleUrls: ['./contenido-nav.component.scss'],
  standalone: true,
  imports:[IonicModule,Link1Component]
})
export class ContenidoNavComponent  implements OnInit {
  
  @Input()
  colores : ColoresDTO = {
    primaryColor: '',
    secundaryColor: ''
  }

  @Input()
 menu: MenuDTO [] = []

@Input()
negocio :BussinesDTO = {
  idBussines: 0,
  nombreNegocio: '',
  numeroIdentificacionNegocio: 0,
  telofono: '',
  codigoPais: 0,
  colores: this.colores,
  logo: '',
  urlWhatssapp: ''
}
  

  constructor() {
    this.negocio.urlWhatssapp = this.generarUrlWhatsapp(this.negocio);
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
