import { Component, Input, OnInit } from '@angular/core';

import { ComponentServicesService } from '../../../../../shared/services/component-services.service';
import { CoreModuleLib } from '../../../../../../modulos/core.lib.module';
import { BusinessDTO, ComponentesDTO } from '@juliaosistem/core-dtos';
@Component({
  selector: 'lib-layout-services1',
  standalone: true,
  imports: [CoreModuleLib],
  templateUrl: './layout-services1.component.html',
  styleUrl: './layout-services1.component.css',
})
export class LayoutServices1Component  implements OnInit {
  componente: ComponentesDTO = {
    id: 6,
    nombreComponente: 'lib-layout-services1',
    version: '1.0',
  };

  @Input()
  negocio: BusinessDTO = {
    businessModule: [],
    telefono: ''
  };

  constructor(private componentSvc: ComponentServicesService) {}

  ngOnInit(): void {
    if (
      this.negocio.productos != undefined &&
      this.negocio.productos.length != 0
    ) {
      this.negocio.productos =
        this.componentSvc.findProductosByIdCategori(
          this.negocio.productos,
          'e3a84c75-b98e-4b1b-912d-bf226da4b511',
        );
    }
  }
}
