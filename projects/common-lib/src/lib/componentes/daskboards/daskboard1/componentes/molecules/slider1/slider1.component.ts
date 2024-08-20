import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { PlantillaDTO } from '../../../models/PlantillaDTO';
import { TranslateService } from '@ngx-translate/core';
import { CoreModule } from '../../../../../../core/core.module';


 register();

@Component({
  selector: 'lib-slider1',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './slider1.component.html',
  styleUrl: './slider1.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class Slider1Component {

  @Input()
  negocio :PlantillaDTO | undefined;
  
  constructor( private translate: TranslateService,){}

}
