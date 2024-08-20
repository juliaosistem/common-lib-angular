import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { Nav1Component } from '../../molecules/nav1/nav1.component';
import { Footer1Component } from '../../molecules/footer1/footer1.component';
import { Slider1Component } from '../../molecules/slider1/slider1.component';
import { TranslateService } from '@ngx-translate/core';
import { PlantillaDTO } from '../../../models/PlantillaDTO';

@Component({
  selector: 'lib-index1',
  standalone: true,
  imports: [IonicModule, Nav1Component,Footer1Component,Slider1Component],
  templateUrl: './index1.component.html',
  styleUrl: './index1.component.css'
})
export class Index1Component {
  isMovile = false;
  langs:string[]=[];



  @Input()
  negocio: PlantillaDTO ={
    id: ''
  };

  alertButtons = ['Action'];
 constructor(private platform: Platform, 
  private breakpointObserver: BreakpointObserver,
  private translate: TranslateService,
) {
    this.langs= this.translate.getLangs();
    this.translate.addLangs(["es","en","de","pt"]);
    if(this.negocio?.bussinesDTO?.lenguaje)
    this.translate.use(this.negocio.bussinesDTO.lenguaje);
  console.log("langs", this.langs);
 }

 ngOnInit(): void {
    this.isMovile = this.platform.is('mobile');
    this.checkScreenSize();
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
