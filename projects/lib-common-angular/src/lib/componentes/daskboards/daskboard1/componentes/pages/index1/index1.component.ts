import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { Nav1Component } from '../../molecules/nav1/nav1.component';
import { Slider1Component } from '../../molecules/slider1/slider1.component';
import { Footer1Component } from '../../molecules/footer1/footer1.component';
import { ServicesSection1Component } from '../../molecules/services-section1/services-section1.component';
import { GallerySection1Component } from '../../molecules/gallery-section1/gallery-section1.component';

import { PlantillaDTO } from 'juliaositembackenexpress/dist/api/dtos/bussines/PlantillaDTO';

@Component({
  selector: 'lib-index1',
  standalone: true,
  imports: [
    IonicModule,
    Nav1Component,
    Slider1Component,
    Footer1Component, 
    ServicesSection1Component,
    GallerySection1Component,
  ],
  templateUrl: './index1.component.html',
  styleUrl: './index1.component.css',
})
export class Index1Component {
    isMovile = false;
  langs:string[]=[];



  @Input()
  negocio: PlantillaDTO ={
    id: ''
  };

 constructor(private platform: Platform, 
  private breakpointObserver: BreakpointObserver,
  private translate: TranslateService,
) {
    
  this.configurarIdiomas()
 }

 ngOnInit(): void {
    this.isMovile = this.platform.is('mobile');
    this.checkScreenSize();
 }

 configurarIdiomas(){
  this.langs= this.translate.getLangs();
  this.translate.addLangs(["es","en","de","pt"]);
  let defualtBrowserLang = this.translate.getBrowserLang();
  if(defualtBrowserLang) {
     this.translate.use(defualtBrowserLang);
  }else{
       (this.negocio?.bussinesDTO?.lenguaje)
          ? this.translate.use(this.negocio.bussinesDTO.lenguaje)
          :this.translate.use("en")
  }
 }

 checkScreenSize() {
   this.breakpointObserver.observe([
     Breakpoints.Handset, 
     Breakpoints.Small
   ]).subscribe(result => {
     if (result.matches) {
       this.isMovile = true;
     } else {
       this.isMovile = false;
     }
   });
 }
}
