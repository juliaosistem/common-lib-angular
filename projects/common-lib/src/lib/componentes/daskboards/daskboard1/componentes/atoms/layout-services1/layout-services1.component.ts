import { Component, Input, OnInit } from '@angular/core';
import { PlantillaDTO } from '../../../models/PlantillaDTO';
import { ComponentesDTO } from '../../../models/componentesDTO';

import { ComponentServicesService } from '../../../../../../core/component-services.service';
import { CoreModuleLib } from '../../../../../../modulos/core.lib.module';

@Component({
  selector: 'lib-layout-services1',
  standalone: true,
  imports: [CoreModuleLib],
  templateUrl: './layout-services1.component.html',
  styleUrl: './layout-services1.component.css'
})
export class LayoutServices1Component implements OnInit{
  
  
  componente:ComponentesDTO = {
    id: 'a2827619-dd9e-44ad-a014-201355756328',
    nombreComponente: 'lib-layout-services1',
    version: '1.0',
  }
  
  @Input()
  negocio : PlantillaDTO  = {
    id: '',
    bussinesDTO: undefined,
    menu: undefined
  } 

  constructor(private componentSvc: ComponentServicesService){}

  ngOnInit(): void {
    if(this.negocio.bussinesDTO?.productos != undefined && this.negocio.bussinesDTO.productos.length != 0){
      this.negocio.bussinesDTO.productos = this.componentSvc.findProductosByIdCategori(this.negocio.bussinesDTO.productos,'e3a84c75-b98e-4b1b-912d-bf226da4b511')
    }
  }
}
