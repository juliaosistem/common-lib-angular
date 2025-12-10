import { Component, Input } from '@angular/core';
import { ComponentesDTO } from '@juliaosistem/core-dtos';

@Component({
  selector: 'lib-header-top-ecommerce1',
  imports: [],
  templateUrl: './header-top-ecommerce1.html',
  styleUrl: './header-top-ecommerce1.scss',
})
export class HeaderTopEcommerce1 {

  // Metadata del componente  
    componente:ComponentesDTO = {
            id: 35,
            nombreComponente: 'lib-header-top-ecommerce1',
            version: '1.0',
            descripcion: 'componente header top  de eccomerce 1'
          }
  
  @Input() whatsappLink: string = '';
  @Input() facebookLink: string = '';
  @Input() instagramLink: string = '';

}
