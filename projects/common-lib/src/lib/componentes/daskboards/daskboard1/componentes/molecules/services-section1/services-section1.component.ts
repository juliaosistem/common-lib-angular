import { Component, Input } from '@angular/core';
import { LayoutServices1Component } from '../../atoms/layout-services1/layout-services1.component';
import { PlantillaDTO } from '../../../models/PlantillaDTO';
import { CoreModule } from '../../../../../../core/core.module';

@Component({
  selector: 'lib-services-section1',
  standalone: true,
  imports: [LayoutServices1Component,CoreModule],
  templateUrl: './services-section1.component.html',
  styleUrl: './services-section1.component.css'
})
export class ServicesSection1Component {

  @Input()
  negocio : PlantillaDTO  = {
    id: '',
    bussinesDTO: undefined,
    slider: [],
    menu: undefined
  }  
}
