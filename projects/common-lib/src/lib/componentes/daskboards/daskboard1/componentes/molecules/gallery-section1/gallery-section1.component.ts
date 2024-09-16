import { ComponentServicesService } from './../../../../../../core/component-services.service';
import { ComponentesDTO } from '../../../models/componentesDTO';
import { ImagenDTO } from '../../../models/ImagenDTO';
import { CoreModule } from './../../../../../../core/core.module';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lib-gallery-section1',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './gallery-section1.component.html',
  styleUrl: './gallery-section1.component.css'
})
export class GallerySection1Component implements OnInit {
  @Input()
  imagenes :ImagenDTO[] | undefined

  componente:ComponentesDTO = {
    id: '325c5d25-a7bd-4e35-a2f7-a74550b78b43',
    nombreComponente: 'lib-gallery-section1',
    version: '1.0',
  }


  constructor(private compSvc:ComponentServicesService){
    
  }
  ngOnInit(): void {
    var imgs
     if(this.imagenes != undefined && this.imagenes.length !=0 ){
      debugger;
      imgs= this.compSvc.findImagenesByIdComponent(this.imagenes ,this.componente.id);
     }

     console.log("images" , imgs)
     console.log("im-", this.imagenes)
     
  }
  


}
