import { Component, Input } from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'lib-select-input1',
  standalone: true,
  imports: [CoreModule,IonicModule],
  templateUrl: './select-input1.component.html',
  styleUrl: './select-input1.component.css'
})
export class SelectInput1Component {
  seleccionada:string ="";

  @Input()
  lenguages :string[] =[]

  constructor(private translate: TranslateService,
  ){}

  cambiaLang(event:string){
    this.translate.use(event);
     
   }

}
