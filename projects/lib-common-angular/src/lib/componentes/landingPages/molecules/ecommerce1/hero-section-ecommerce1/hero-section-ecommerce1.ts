import { Component, OnInit } from '@angular/core';
import { ComponentesDTO } from '@juliaosistem/core-dtos';
import { PrimegModule } from '../../../../../modulos/primeg.module';

@Component({
  selector: 'lib-hero-section-ecommerce1',
  imports: [PrimegModule],
  templateUrl: './hero-section-ecommerce1.html',
  styleUrl: './hero-section-ecommerce1.css',
})
export class HeroSectionEcommerce1  implements OnInit {
      ngOnInit(): void {
       console.log('HeroSectionEcommerce1 component initialized');
      }

  // Metadata del componente    
      componente:ComponentesDTO = {
              id: 30,
              nombreComponente: 'lib-hero-section-ecommerce1',
              version: '1.0',
              descripcion: 'Componente para mostrar la sección de héroe en la página de ecommerce1'
            }
    

}
