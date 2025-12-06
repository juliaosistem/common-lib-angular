import { Component, ViewEncapsulation } from '@angular/core';
import { ComponentesDTO } from '@juliaosistem/core-dtos';

@Component({
  selector: 'lib-section-images-instagram-ecommerce1',
  imports: [],
  templateUrl: './section-images-instagram-ecommerce1.html',
  styleUrl: './section-images-instagram-ecommerce1.scss',
  encapsulation: ViewEncapsulation.None
})
export class SectionImagesInstagramEcommerce1 {

  // Metadata del componente    
        componente:ComponentesDTO = {
                id: 31,
                nombreComponente: 'lib-section-images-instagram-ecommerce1',
                version: '1.0',
                descripcion: 'Componente para mostrar imágenes de Instagram en la página de ecommerce1'
              }
}
