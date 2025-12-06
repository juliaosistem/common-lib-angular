import { Component, ViewEncapsulation } from '@angular/core';
import { ComponentesDTO } from '@juliaosistem/core-dtos';

@Component({
  selector: 'lib-footer-ecommerce1',
  imports: [],
  templateUrl: './footer-ecommerce1.html',
  styleUrl: './footer-ecommerce1.scss',
  encapsulation: ViewEncapsulation.None
})
export class FooterEcommerce1 {

       componente:ComponentesDTO = {
                  id: 32,
                  nombreComponente: 'lib-footer-ecommerce1',
                  version: '1.0',
                  descripcion: 'Componente para mostrar el pie de página en la página de ecommerce1'
                }
}
