import { Component, Input } from '@angular/core';
import { LayoutServices1Component } from '../../atoms/layout-services1/layout-services1.component';
import { CoreModuleLib } from '../../../../../../modulos/core.lib.module';
import { ComponentesDTO } from 'juliaositembackenexpress/dist/api/dtos/bussines/componentesDTO';
import { PlantillaDTO } from 'juliaositembackenexpress/dist/api/dtos/bussines/PlantillaDTO';

@Component({
  selector: 'lib-services-section1',
  standalone: true,
  imports: [LayoutServices1Component,CoreModuleLib],
  templateUrl: './services-section1.component.html',
  styleUrl: './services-section1.component.css'
})
export class ServicesSection1Component {

  componente:ComponentesDTO = {
    id: '0434a895-51a7-488f-8d10-f3c07429c126',
    nombreComponente: 'lib-services-section1',
    version: '1.0',
  }

  @Input()
  negocio : PlantillaDTO  = {
    id: '',
    bussinesDTO: undefined,
    menu: undefined
  }  
}
