import { Component } from '@angular/core';
import { ComponentesDTO } from '@juliaosistem/core-dtos';

@Component({
  selector: 'lib-hero-section-ecommerce1',
  imports: [],
  templateUrl: './hero-section-ecommerce1.html',
  styleUrl: './hero-section-ecommerce1.css'
})
export class HeroSectionEcommerce1 {

  // Metadata del componente    
      componente:ComponentesDTO = {
              id: 30,
              nombreComponente: 'lib-hero-section-ecommerce1',
              version: '1.0',
              descripcion: 'Componente para mostrar la sección de héroe en la página de ecommerce1'
            }
    

}
