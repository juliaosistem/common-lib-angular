import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input } from '@angular/core';
import { BussinesDTO } from '../../../models/BussinesDTO';
import { MenuDTO } from '../../../models/MenuDTO';
import { ColoresDTO } from '../../../models/ColoresDTO';
import { IonicModule, Platform } from '@ionic/angular';
import { ContenidoNavComponent } from '../../molecules/contenido-nav/contenido-nav.component';

@Component({
  selector: 'lib-index1',
  standalone: true,
  imports: [IonicModule, ContenidoNavComponent],
  templateUrl: './index1.component.html',
  styleUrl: './index1.component.css'
})
export class Index1Component {
  isMovile = false;

  @Input()
  menu: MenuDTO [] = [];
 
  @Input ()
   colores :ColoresDTO ={
     primaryColor: '',
     secundaryColor: ''
   }
   
  @Input()
  negocio: BussinesDTO ={
    idBussines: 0,
    nombreNegocio: '',
    numeroIdentificacionNegocio: 0,
    telofono: '',
    codigoPais: 0,
    colores: this.colores,
    logo: '',
    urlWhatssapp: ''
  }
  alertButtons = ['Action'];
 constructor(private platform: Platform, private breakpointObserver: BreakpointObserver) {
 }

 ngOnInit(): void {
    this.isMovile = this.platform.is('mobile');
    this.checkScreenSize();
 }


 checkScreenSize() {
   this.breakpointObserver.observe([
     Breakpoints.Handset, 
     Breakpoints.Small
   ]).subscribe(result => {
     if (result.matches) {
       this.isMovile = true;
     } else {
       this.isMovile = false;
     }
   });
 }
}
