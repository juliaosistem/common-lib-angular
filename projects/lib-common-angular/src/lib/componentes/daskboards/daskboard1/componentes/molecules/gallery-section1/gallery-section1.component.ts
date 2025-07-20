import { ComponentServicesService } from '../../../../../shared/services/component-services.service'
import { CoreModuleLib } from '../../../../../../modulos/core.lib.module';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import{ImagenDTO} from 'juliaositembackenexpress/dist/api/dtos/bussines/ImagenDTO';
import { ComponentesDTO } from 'juliaositembackenexpress/dist/api/dtos/bussines/componentesDTO';

@Component({
  selector: 'lib-gallery-section1',
  standalone: true,
  imports: [CoreModuleLib,CommonModule],
  templateUrl: './gallery-section1.component.html',
  styleUrl: './gallery-section1.component.css'
})
export class GallerySection1Component implements OnInit {
  @Input()
  imagenes :ImagenDTO[] | undefined

  componente:ComponentesDTO = {
    id: 5,
    nombreComponente: 'lib-gallery-section1',
    version: '1.0',
  }


  constructor(private compSvc:ComponentServicesService){
    
  }
  ngOnInit(): void {
    /* let imgs
     if(this.imagenes != undefined && this.imagenes.length !=0 ){

      imgs = this.compSvc.findImagenesByIdComponent(this.imagenes ,this.componente.id);
     } */
  }
  


}
