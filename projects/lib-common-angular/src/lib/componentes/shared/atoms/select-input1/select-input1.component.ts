import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CoreModuleLib } from '../../../../modulos/core.lib.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentesDTO } from 'juliaositembackenexpress/dist/api/dtos/bussines/componentesDTO';

@Component({
  selector: 'lib-select-input1',
  standalone: true,
  imports: [CoreModuleLib,IonicModule,FormsModule,CommonModule],
  templateUrl: './select-input1.component.html',
  styleUrl: './select-input1.component.css'
})
export class SelectInput1Component {

  componente: ComponentesDTO = {
    id: 13,
    nombreComponente: 'lib-select-input1',
    version: '1.0',
  };

  seleccionada:string ="";

  @Input()
  lenguages :string[] =[]

  constructor(private translate: TranslateService,
  ){}

  cambiaLang(event:string){
    this.translate.use(event);
     
   }

}
