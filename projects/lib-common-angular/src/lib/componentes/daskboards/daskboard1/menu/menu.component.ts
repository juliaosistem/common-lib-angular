import { Component, Input } from '@angular/core';
import { CoreModuleLib } from '../../../../modulos/core.lib.module';
import { BodyComponent } from '../body/body.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'lib-menu',
  standalone: true,
  imports: [CoreModuleLib,BodyComponent,FooterComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  @Input() appName: string = '';
  @Input() logoSrc: string = '';
  @Input() email: string = '';
  
}
