import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { TranslateService } from '@ngx-translate/core';
import { CoreModuleLib } from '../../../../../../modulos/core.lib.module';
import { CommonModule } from '@angular/common';
import { SliderDTO } from 'juliaositembackenexpress/dist/api/dtos/bussines/sliderDTO';
import { ComponentesDTO } from 'juliaositembackenexpress/dist/api/dtos/bussines/componentesDTO';
import { PlantillaDTO } from 'juliaositembackenexpress/dist/api/dtos/bussines/PlantillaDTO';

 register();

@Component({
  selector: 'lib-slider1',
  standalone: true,
  imports: [CoreModuleLib,CommonModule],
  templateUrl: './slider1.component.html',
  styleUrl: './slider1.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class Slider1Component implements OnInit {

  @Input()
  negocio :PlantillaDTO | undefined;

  componente:ComponentesDTO = {
    id: 1,
    nombreComponente: 'lib-slider1',
    version: '1.0',
  }

  slides: SliderDTO[]=[];
  
  constructor( private translate: TranslateService,){

  }
  ngOnInit(): void {
    this.validarComponente();
  
  }


  validarComponente() {
    if (this.negocio != undefined) {
      this.negocio.bussinesDTO?.businessModule.forEach(modulo => {
        modulo.modulosComponentes.forEach(componente => {
          if (componente.componente.sliderDTO && componente.id === this.componente.id) {
            this.slides =componente.componente.sliderDTO;
          }
        });
      });
    }
  }
}
