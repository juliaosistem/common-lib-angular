import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { ContenidoNavComponent } from '../contenido-nav/contenido-nav.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BusinessDTO, ComponentesDTO } from '@juliaosistem/core-dtos';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'lib-nav1',
  standalone: true,
  imports: [IonicModule, ContenidoNavComponent,StyleClassModule],
  templateUrl: './nav1.component.html',
  styleUrl: './nav1.component.css'
})
export class Nav1Component implements OnInit {
  isMovile = false;

  @Input()
  lenguages :string[] = [];

  @Input()
   negocio : BusinessDTO  = {
     businessModule: [],
     telefono: ''
   }

  
   componente:ComponentesDTO = {
    id: 3,
    nombreComponente: 'lib-nav1',
    version: '1.0',
  }
  
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
